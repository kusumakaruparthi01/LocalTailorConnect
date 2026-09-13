import { and, desc, eq, inArray, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { canAccessOrder, requireAccountType } from '../../server/authz.js';
import { db } from '../../server/db/client.js';
import {
  appointments,
  measurementProfiles,
  messages,
  notifications,
  orderTimelineEvents,
  orders,
  quotationItems,
  quotations,
  reviews,
  savedTailors,
  tailorPortfolioItems,
  tailorProfiles,
  tailorServices,
  user,
} from '../../server/db/schema.js';
import { getActor, HttpError, sendError } from '../../server/http.js';
import type { ApiRequest, ApiResponse } from '../../server/api-types.js';
import { profileUpdateSchema } from '../../server/validation/profile.js';

const idSchema = z.string().uuid();
const text = (max: number) => z.string().trim().min(1).max(max);
const tailorUser = alias(user, 'tailor_user');

const orderCreateSchema = z.object({
  tailorId: idSchema,
  serviceType: text(60),
  garmentType: text(100),
  requirements: z.string().trim().max(5000).default(''),
  referenceImages: z.array(z.string().url()).max(8).default([]),
  measurementProfileName: z.string().trim().max(120).default(''),
  measurements: z.record(z.string(), z.union([z.number(), z.string()])).default({}),
  deliveryOption: text(60),
  deliveryAddress: z.string().trim().max(500).optional(),
  estimatedCompletion: z.string().trim().max(100).default(''),
});

const messageSchema = z.object({
  text: text(4000),
  attachmentUrl: z.string().url().optional(),
});

function routeParts(req: ApiRequest) {
  const rewrittenPath = req.query.path;
  if (rewrittenPath) {
    return (Array.isArray(rewrittenPath) ? rewrittenPath : [rewrittenPath])
      .flatMap((part) => part.split('/'))
      .filter(Boolean)
      .map(decodeURIComponent);
  }
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  const prefix = '/api/domain/';
  if (!pathname.startsWith(prefix)) return [];
  return pathname
    .slice(prefix.length)
    .split('/')
    .filter(Boolean)
    .map(decodeURIComponent);
}

async function publicTailors(includeOwnerId?: string, includeAll = false) {
  const rows = await db
    .select({ profile: tailorProfiles, owner: user })
    .from(tailorProfiles)
    .innerJoin(user, eq(user.id, tailorProfiles.userId))
    .where(includeAll
      ? undefined
      : includeOwnerId
      ? or(eq(tailorProfiles.verificationStatus, 'verified'), eq(tailorProfiles.userId, includeOwnerId))
      : eq(tailorProfiles.verificationStatus, 'verified'));

  return Promise.all(rows.map(async ({ profile, owner }) => {
    const [services, portfolio, reviewRows] = await Promise.all([
      db.select().from(tailorServices).where(eq(tailorServices.tailorId, profile.id)),
      db.select().from(tailorPortfolioItems).where(eq(tailorPortfolioItems.tailorId, profile.id)),
      db.select().from(reviews).where(eq(reviews.tailorId, profile.id)),
    ]);
    const rating = reviewRows.length
      ? reviewRows.reduce((sum, review) => sum + review.rating, 0) / reviewRows.length
      : 0;
    return {
      id: profile.id,
      name: owner.name,
      shopName: profile.shopName,
      tagline: profile.tagline,
      avatar: profile.avatarUrl || owner.image || '',
      coverImage: profile.coverImageUrl || '',
      rating,
      reviewCount: reviewRows.length,
      distanceKm: 0,
      experienceYears: profile.experienceYears,
      address: profile.address,
      city: owner.city,
      pincode: profile.pincode,
      startingPrice: profile.startingPricePaise / 100,
      availableToday: profile.availableToday,
      homePickup: profile.homePickup,
      deliveryAvailable: profile.deliveryAvailable,
      phone: owner.phone,
      email: owner.email,
      workingHours: profile.workingHours,
      isVerified: profile.verificationStatus === 'verified',
      verificationStatus: profile.verificationStatus,
      specializations: profile.specializations,
      about: profile.about,
      coordinates: { lat: 0, lng: 0 },
      services: services.map((service) => ({
        id: service.id,
        name: service.name,
        category: service.category,
        startingPrice: service.startingPricePaise / 100,
        estimatedTime: service.estimatedTime,
        description: service.description || undefined,
      })),
      portfolio: portfolio.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        imageUrl: item.imageUrl,
      })),
      reviews: reviewRows.map((review) => ({
        id: review.id,
        customerName: 'Verified customer',
        rating: review.rating,
        date: review.createdAt.toISOString(),
        comment: review.comment,
        garmentType: 'Completed order',
        breakdown: review.breakdown,
      })),
    };
  }));
}

async function getOrder(orderId: string) {
  const [row] = await db
    .select({ order: orders, customer: user, tailor: tailorProfiles, tailorUser })
    .from(orders)
    .innerJoin(user, eq(user.id, orders.customerUserId))
    .innerJoin(tailorProfiles, eq(tailorProfiles.id, orders.tailorId))
    .innerJoin(tailorUser, eq(tailorUser.id, tailorProfiles.userId))
    .where(eq(orders.id, orderId))
    .limit(1);
  return row;
}

async function orderToDto(row: NonNullable<Awaited<ReturnType<typeof getOrder>>>) {
  const [timeline, quote] = await Promise.all([
    db.select().from(orderTimelineEvents).where(eq(orderTimelineEvents.orderId, row.order.id)).orderBy(orderTimelineEvents.createdAt),
    db.select().from(quotations).where(eq(quotations.orderId, row.order.id)).limit(1),
  ]);
  const items = quote[0]
    ? await db.select().from(quotationItems).where(eq(quotationItems.quotationId, quote[0].id))
    : [];
  return {
    id: row.order.id,
    orderNumber: row.order.orderNumber,
    customerId: row.order.customerUserId,
    customerName: row.customer.name,
    customerPhone: row.customer.phone,
    tailorId: row.order.tailorId,
    tailorName: row.tailorUser.name,
    tailorShop: row.tailor.shopName,
    tailorPhone: row.tailorUser.phone,
    serviceType: row.order.serviceType,
    garmentType: row.order.garmentType,
    requirements: row.order.requirements,
    referenceImages: row.order.referenceImages,
    measurementProfileName: row.order.measurementProfileName,
    measurements: row.order.measurements,
    deliveryOption: row.order.deliveryOption,
    deliveryAddress: row.order.deliveryAddress || undefined,
    status: row.order.status,
    estimatedCompletion: row.order.estimatedCompletion,
    createdAt: row.order.createdAt.toISOString(),
    totalAmount: row.order.totalAmountPaise / 100,
    paymentStatus: row.order.paymentStatus,
    paymentMethod: row.order.paymentMethod || undefined,
    timeline: timeline.map((event) => ({
      status: event.status,
      timestamp: event.createdAt.toISOString(),
      completed: true,
      note: event.note || undefined,
    })),
    quotation: quote[0] ? {
      id: quote[0].id,
      orderId: row.order.id,
      customerName: row.customer.name,
      serviceName: quote[0].serviceName,
      items: items.map((item) => ({ id: item.id, title: item.title, amount: item.amountPaise / 100 })),
      totalAmount: quote[0].totalAmountPaise / 100,
      status: quote[0].status,
      sentDate: quote[0].createdAt.toISOString(),
      notes: quote[0].notes || undefined,
    } : undefined,
  };
}

async function authorizedOrders(actor: Awaited<ReturnType<typeof getActor>>) {
  const where = actor.accountType === 'customer'
    ? eq(orders.customerUserId, actor.id)
    : actor.accountType === 'tailor' && actor.tailorProfileId
      ? eq(orders.tailorId, actor.tailorProfileId)
      : undefined;
  if (actor.accountType !== 'admin' && !where) return [];
  const ids = await db.select({ id: orders.id }).from(orders).where(where).orderBy(desc(orders.createdAt));
  const rows = await Promise.all(ids.map(({ id }) => getOrder(id)));
  return Promise.all(rows.filter(Boolean).map((row) => orderToDto(row!)));
}

async function bootstrap(req: ApiRequest, res: ApiResponse) {
  const actor = await getActor(req);
  const [authUser] = await db.select().from(user).where(eq(user.id, actor.id)).limit(1);
  const [tailorList, orderList] = await Promise.all([
    publicTailors(actor.accountType === 'tailor' ? actor.id : undefined, actor.accountType === 'admin'),
    authorizedOrders(actor),
  ]);
  const orderIds = orderList.map((order) => order.id);
  const [measurements, appointmentRows, messageRows, notificationRows, savedRows] = await Promise.all([
    actor.accountType === 'customer'
      ? db.select().from(measurementProfiles).where(eq(measurementProfiles.customerUserId, actor.id))
      : [],
    actor.accountType === 'customer'
      ? db.select().from(appointments).where(eq(appointments.customerUserId, actor.id))
      : actor.accountType === 'tailor' && actor.tailorProfileId
        ? db.select().from(appointments).where(eq(appointments.tailorId, actor.tailorProfileId))
        : db.select().from(appointments),
    orderIds.length
      ? db.select({ message: messages, sender: user }).from(messages)
          .innerJoin(user, eq(user.id, messages.senderUserId))
          .where(inArray(messages.orderId, orderIds)).orderBy(messages.createdAt)
      : [],
    db.select().from(notifications).where(eq(notifications.userId, actor.id)).orderBy(desc(notifications.createdAt)),
    actor.accountType === 'customer'
      ? db.select().from(savedTailors).where(eq(savedTailors.customerUserId, actor.id))
      : [],
  ]);
  const tailorById = new Map(tailorList.map((tailor) => [tailor.id, tailor]));
  const customer = actor.accountType === 'customer' ? {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    phone: authUser.phone,
    city: authUser.city,
    avatar: authUser.image || '',
    savedTailorIds: savedRows.map((saved) => saved.tailorId),
  } : null;
  return res.json({
    currentUser: {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: actor.accountType,
      phone: authUser.phone,
      city: authUser.city,
      shopName: authUser.shopName || undefined,
      avatar: authUser.image || '',
    },
    customer,
    tailorProfile: actor.tailorProfileId ? tailorById.get(actor.tailorProfileId) || null : null,
    tailors: tailorList,
    orders: orderList,
    measurementProfiles: measurements.map((profile) => ({
      id: profile.id,
      customerId: profile.customerUserId,
      profileName: profile.profileName,
      garmentCategory: profile.garmentCategory,
      isDefault: profile.isDefault,
      updatedAt: profile.updatedAt.toISOString(),
      measurements: profile.measurements,
    })),
    appointments: appointmentRows.map((appointment) => ({
      id: appointment.id,
      customerId: appointment.customerUserId,
      customerName: orderList.find((order) => order.customerId === appointment.customerUserId)?.customerName || 'Customer',
      tailorId: appointment.tailorId,
      tailorShop: tailorById.get(appointment.tailorId)?.shopName || 'Tailor',
      type: appointment.type,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      address: appointment.address,
      status: appointment.status,
      notes: appointment.notes || undefined,
    })),
    messages: messageRows.map(({ message, sender }) => ({
      id: message.id,
      orderId: message.orderId,
      senderId: message.senderUserId,
      senderRole: sender.accountType,
      senderName: sender.name,
      text: message.body,
      timestamp: message.createdAt.toISOString(),
      isRead: Boolean(message.readAt),
      attachmentUrl: message.attachmentUrl || undefined,
    })),
    notifications: notificationRows.map((notification) => ({
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      timestamp: notification.createdAt.toISOString(),
      isRead: Boolean(notification.readAt),
      type: notification.type,
      orderId: notification.orderId || undefined,
    })),
  });
}

async function handler(req: ApiRequest, res: ApiResponse) {
  const parts = routeParts(req);
  try {
    if (req.method === 'GET' && parts[0] === 'tailors') {
      return res.json({ tailors: await publicTailors() });
    }
    if (req.method === 'GET' && parts[0] === 'bootstrap') return bootstrap(req, res);

    const actor = await getActor(req);

    if (req.method === 'PATCH' && parts[0] === 'profile') {
      const input = profileUpdateSchema.parse(req.body);
      if (actor.accountType === 'tailor' && !input.shopName) {
        throw new HttpError(400, 'Workshop name is required for tailor accounts');
      }
      await db.transaction(async (tx) => {
        await tx.update(user).set({
          name: input.name,
          phone: input.phone,
          city: input.city,
          shopName: actor.accountType === 'tailor' ? input.shopName : null,
          updatedAt: new Date(),
        }).where(eq(user.id, actor.id));
        if (actor.accountType === 'tailor' && actor.tailorProfileId) {
          await tx.update(tailorProfiles).set({
            shopName: input.shopName!,
            updatedAt: new Date(),
          }).where(eq(tailorProfiles.id, actor.tailorProfileId));
        }
      });
      return res.json({ ok: true });
    }

    if (req.method === 'POST' && parts[0] === 'orders' && parts.length === 1) {
      requireAccountType(actor, 'customer');
      const input = orderCreateSchema.parse(req.body);
      const orderNumber = `LTC-${Date.now().toString(36).toUpperCase()}`;
      const [created] = await db.transaction(async (tx) => {
        const inserted = await tx.insert(orders).values({
          orderNumber,
          customerUserId: actor.id,
          tailorId: input.tailorId,
          serviceType: input.serviceType,
          garmentType: input.garmentType,
          requirements: input.requirements,
          referenceImages: input.referenceImages,
          measurementProfileName: input.measurementProfileName,
          measurements: input.measurements,
          deliveryOption: input.deliveryOption,
          deliveryAddress: input.deliveryAddress,
          estimatedCompletion: input.estimatedCompletion,
        }).returning();
        await tx.insert(orderTimelineEvents).values({
          orderId: inserted[0].id,
          status: 'Request Received',
          note: 'Customer submitted the request.',
          actorUserId: actor.id,
        });
        return inserted;
      });
      return res.status(201).json({ order: await orderToDto((await getOrder(created.id))!) });
    }

    if (parts[0] === 'orders' && parts[1]) {
      const orderId = idSchema.parse(parts[1]);
      const row = await getOrder(orderId);
      if (!row || !canAccessOrder(actor, row.order)) throw new HttpError(404, 'Order not found');

      if (req.method === 'GET' && parts.length === 2) {
        return res.json({ order: await orderToDto(row) });
      }
      if (req.method === 'POST' && parts[2] === 'messages') {
        const input = messageSchema.parse(req.body);
        const [created] = await db.insert(messages).values({
          orderId,
          senderUserId: actor.id,
          body: input.text,
          attachmentUrl: input.attachmentUrl,
        }).returning();
        return res.status(201).json({ message: created });
      }
      if (req.method === 'PATCH' && parts[2] === 'status') {
        requireAccountType(actor, 'tailor');
        if (row.order.tailorId !== actor.tailorProfileId) throw new HttpError(403, 'Forbidden');
        const input = z.object({ status: text(40), note: z.string().max(1000).optional() }).parse(req.body);
        await db.transaction(async (tx) => {
          await tx.update(orders).set({ status: input.status, updatedAt: new Date(), version: row.order.version + 1 })
            .where(eq(orders.id, orderId));
          await tx.insert(orderTimelineEvents).values({
            orderId,
            status: input.status,
            note: input.note,
            actorUserId: actor.id,
          });
          await tx.insert(notifications).values({
            userId: row.order.customerUserId,
            type: 'order',
            title: 'Order update',
            message: `Order ${row.order.orderNumber} moved to ${input.status}.`,
            orderId,
          });
        });
        return res.json({ ok: true });
      }
      if (req.method === 'POST' && parts[2] === 'quotation') {
        requireAccountType(actor, 'tailor');
        if (row.order.tailorId !== actor.tailorProfileId) throw new HttpError(403, 'Forbidden');
        const input = z.object({
          serviceName: z.string().max(120).default('Tailoring service'),
          notes: z.string().max(1000).optional(),
          items: z.array(z.object({ title: text(200), amount: z.number().nonnegative() })).min(1).max(20),
        }).parse(req.body);
        const totalAmountPaise = input.items.reduce((sum, item) => sum + Math.round(item.amount * 100), 0);
        await db.transaction(async (tx) => {
          const [quote] = await tx.insert(quotations).values({
            orderId,
            serviceName: input.serviceName,
            notes: input.notes,
            totalAmountPaise,
          }).onConflictDoUpdate({
            target: quotations.orderId,
            set: { serviceName: input.serviceName, notes: input.notes, totalAmountPaise, status: 'Pending', updatedAt: new Date() },
          }).returning();
          await tx.delete(quotationItems).where(eq(quotationItems.quotationId, quote.id));
          await tx.insert(quotationItems).values(input.items.map((item) => ({
            quotationId: quote.id,
            title: item.title,
            amountPaise: Math.round(item.amount * 100),
          })));
          await tx.update(orders).set({ status: 'Quote Sent', totalAmountPaise }).where(eq(orders.id, orderId));
        });
        return res.json({ ok: true });
      }
      if (req.method === 'PATCH' && parts[2] === 'quotation') {
        requireAccountType(actor, 'customer');
        if (row.order.customerUserId !== actor.id) throw new HttpError(403, 'Forbidden');
        const { accept } = z.object({ accept: z.boolean() }).parse(req.body);
        await db.update(quotations).set({ status: accept ? 'Accepted' : 'Declined', updatedAt: new Date() })
          .where(eq(quotations.orderId, orderId));
        return res.json({ ok: true });
      }
    }

    if (parts[0] === 'measurements') {
      requireAccountType(actor, 'customer');
      if (req.method === 'POST' && parts.length === 1) {
        const input = z.object({
          profileName: text(120),
          garmentCategory: text(30),
          isDefault: z.boolean().default(false),
          measurements: z.record(z.string(), z.union([z.number(), z.string()])),
        }).parse(req.body);
        const [created] = await db.insert(measurementProfiles).values({
          customerUserId: actor.id,
          ...input,
        }).returning();
        return res.status(201).json({ measurement: created });
      }
      if (parts[1]) {
        const id = idSchema.parse(parts[1]);
        const [owned] = await db.select().from(measurementProfiles)
          .where(and(eq(measurementProfiles.id, id), eq(measurementProfiles.customerUserId, actor.id))).limit(1);
        if (!owned) throw new HttpError(404, 'Measurement profile not found');
        if (req.method === 'DELETE') {
          await db.delete(measurementProfiles).where(eq(measurementProfiles.id, id));
          return res.status(204).end();
        }
        if (req.method === 'PATCH') {
          const input = z.object({
            profileName: z.string().trim().min(1).max(120).optional(),
            measurements: z.record(z.string(), z.union([z.number(), z.string()])).optional(),
          }).parse(req.body);
          await db.update(measurementProfiles).set({ ...input, updatedAt: new Date() }).where(eq(measurementProfiles.id, id));
          return res.json({ ok: true });
        }
      }
    }

    if (req.method === 'POST' && parts[0] === 'appointments') {
      requireAccountType(actor, 'customer');
      const input = z.object({
        tailorId: idSchema,
        orderId: idSchema.optional(),
        type: text(80),
        date: text(40),
        timeSlot: text(40),
        address: text(500),
        notes: z.string().max(1000).optional(),
      }).parse(req.body);
      const [created] = await db.insert(appointments).values({ customerUserId: actor.id, ...input }).returning();
      return res.status(201).json({ appointment: created });
    }

    if (req.method === 'POST' && parts[0] === 'favorites' && parts[1]) {
      requireAccountType(actor, 'customer');
      const tailorId = idSchema.parse(parts[1]);
      const [existing] = await db.select().from(savedTailors)
        .where(and(eq(savedTailors.customerUserId, actor.id), eq(savedTailors.tailorId, tailorId))).limit(1);
      if (existing) {
        await db.delete(savedTailors).where(and(eq(savedTailors.customerUserId, actor.id), eq(savedTailors.tailorId, tailorId)));
      } else {
        await db.insert(savedTailors).values({ customerUserId: actor.id, tailorId });
      }
      return res.json({ saved: !existing });
    }

    if (req.method === 'POST' && parts[0] === 'reviews') {
      requireAccountType(actor, 'customer');
      const input = z.object({
        tailorId: idSchema,
        rating: z.number().int().min(1).max(5),
        comment: text(2000),
        breakdown: z.record(z.string(), z.number().int().min(1).max(5)),
      }).parse(req.body);
      const candidates = await db.select({ order: orders, review: reviews.id })
        .from(orders)
        .leftJoin(reviews, eq(reviews.orderId, orders.id))
        .where(and(
          eq(orders.customerUserId, actor.id),
          eq(orders.tailorId, input.tailorId),
          eq(orders.status, 'Completed'),
        ));
      const eligible = candidates.find((candidate) => !candidate.review);
      if (!eligible) throw new HttpError(409, 'A completed, unreviewed order is required');
      await db.insert(reviews).values({
        orderId: eligible.order.id,
        customerUserId: actor.id,
        tailorId: input.tailorId,
        rating: input.rating,
        comment: input.comment,
        breakdown: input.breakdown,
      });
      return res.status(201).json({ ok: true });
    }

    if (req.method === 'PATCH' && parts[0] === 'notifications' && parts[1]) {
      const notificationId = idSchema.parse(parts[1]);
      const updated = await db.update(notifications).set({ readAt: new Date() })
        .where(and(eq(notifications.id, notificationId), eq(notifications.userId, actor.id)))
        .returning({ id: notifications.id });
      if (!updated.length) throw new HttpError(404, 'Notification not found');
      return res.json({ ok: true });
    }

    if (req.method === 'PATCH' && parts[0] === 'admin' && parts[1] === 'tailors' && parts[2]) {
      requireAccountType(actor, 'admin');
      const tailorId = idSchema.parse(parts[2]);
      const { status } = z.object({ status: z.enum(['pending', 'verified', 'rejected']) }).parse(req.body);
      await db.update(tailorProfiles).set({ verificationStatus: status, updatedAt: new Date() })
        .where(eq(tailorProfiles.id, tailorId));
      return res.json({ ok: true });
    }

    throw new HttpError(404, 'Endpoint not found');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request', details: error.issues });
    }
    return sendError(res, error);
  }
}

export default handler;
