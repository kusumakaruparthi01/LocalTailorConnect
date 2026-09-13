import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const accountTypeEnum = pgEnum('account_type', ['customer', 'tailor']);
export const verificationStatusEnum = pgEnum('verification_status', ['pending', 'verified', 'rejected']);

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  accountType: accountTypeEnum('account_type').notNull(),
  phone: text('phone').notNull(),
  city: text('city').notNull(),
  shopName: text('shop_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
}, (table) => [index('session_user_idx').on(table.userId)]);

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [index('account_user_idx').on(table.userId)]);

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [index('verification_identifier_idx').on(table.identifier)]);

export const customerProfiles = pgTable('customer_profiles', {
  userId: text('user_id').primaryKey().references(() => user.id, { onDelete: 'cascade' }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tailorProfiles = pgTable('tailor_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  shopName: text('shop_name').notNull(),
  tagline: text('tagline').default('Custom tailoring and alterations').notNull(),
  avatarUrl: text('avatar_url'),
  coverImageUrl: text('cover_image_url'),
  address: text('address').default('').notNull(),
  pincode: text('pincode').default('').notNull(),
  experienceYears: integer('experience_years').default(0).notNull(),
  startingPricePaise: integer('starting_price_paise').default(0).notNull(),
  workingHours: text('working_hours').default('By appointment').notNull(),
  availableToday: boolean('available_today').default(false).notNull(),
  homePickup: boolean('home_pickup').default(false).notNull(),
  deliveryAvailable: boolean('delivery_available').default(false).notNull(),
  about: text('about').default('').notNull(),
  specializations: jsonb('specializations').$type<string[]>().default([]).notNull(),
  verificationStatus: verificationStatusEnum('verification_status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [index('tailor_verification_idx').on(table.verificationStatus)]);

export const tailorServices = pgTable('tailor_services', {
  id: uuid('id').defaultRandom().primaryKey(),
  tailorId: uuid('tailor_id').notNull().references(() => tailorProfiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  startingPricePaise: integer('starting_price_paise').notNull(),
  estimatedTime: text('estimated_time').notNull(),
  description: text('description'),
});

export const tailorPortfolioItems = pgTable('tailor_portfolio_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  tailorId: uuid('tailor_id').notNull().references(() => tailorProfiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url').notNull(),
});

export const measurementProfiles = pgTable('measurement_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerUserId: text('customer_user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  profileName: text('profile_name').notNull(),
  garmentCategory: text('garment_category').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  measurements: jsonb('measurements').$type<Record<string, number | string>>().default({}).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('measurement_customer_idx').on(table.customerUserId),
  uniqueIndex('measurement_default_customer_idx')
    .on(table.customerUserId)
    .where(sql`${table.isDefault} = true`),
]);

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  customerUserId: text('customer_user_id').notNull().references(() => user.id),
  tailorId: uuid('tailor_id').notNull().references(() => tailorProfiles.id),
  serviceType: text('service_type').notNull(),
  garmentType: text('garment_type').notNull(),
  requirements: text('requirements').default('').notNull(),
  referenceImages: jsonb('reference_images').$type<string[]>().default([]).notNull(),
  measurementProfileName: text('measurement_profile_name').default('').notNull(),
  measurements: jsonb('measurements').$type<Record<string, number | string>>().default({}).notNull(),
  deliveryOption: text('delivery_option').notNull(),
  deliveryAddress: text('delivery_address'),
  status: text('status').default('Request Received').notNull(),
  estimatedCompletion: text('estimated_completion').default('').notNull(),
  totalAmountPaise: integer('total_amount_paise').default(0).notNull(),
  paymentStatus: text('payment_status').default('Pending').notNull(),
  paymentMethod: text('payment_method'),
  version: integer('version').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('orders_customer_idx').on(table.customerUserId),
  index('orders_tailor_idx').on(table.tailorId),
]);

export const orderTimelineEvents = pgTable('order_timeline_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  note: text('note'),
  actorUserId: text('actor_user_id').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const quotations = pgTable('quotations', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().unique().references(() => orders.id, { onDelete: 'cascade' }),
  serviceName: text('service_name').notNull(),
  totalAmountPaise: integer('total_amount_paise').notNull(),
  status: text('status').default('Pending').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const quotationItems = pgTable('quotation_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  quotationId: uuid('quotation_id').notNull().references(() => quotations.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  amountPaise: integer('amount_paise').notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  senderUserId: text('sender_user_id').notNull().references(() => user.id),
  body: text('body').notNull(),
  attachmentUrl: text('attachment_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  readAt: timestamp('read_at'),
}, (table) => [index('messages_order_created_idx').on(table.orderId, table.createdAt)]);

export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerUserId: text('customer_user_id').notNull().references(() => user.id),
  tailorId: uuid('tailor_id').notNull().references(() => tailorProfiles.id),
  orderId: uuid('order_id').references(() => orders.id),
  type: text('type').notNull(),
  date: text('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  address: text('address').notNull(),
  status: text('status').default('Upcoming').notNull(),
  notes: text('notes'),
}, (table) => [
  index('appointments_customer_idx').on(table.customerUserId),
  index('appointments_tailor_idx').on(table.tailorId),
]);

export const savedTailors = pgTable('saved_tailors', {
  customerUserId: text('customer_user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  tailorId: uuid('tailor_id').notNull().references(() => tailorProfiles.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [primaryKey({ columns: [table.customerUserId, table.tailorId] })]);

export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().unique().references(() => orders.id),
  customerUserId: text('customer_user_id').notNull().references(() => user.id),
  tailorId: uuid('tailor_id').notNull().references(() => tailorProfiles.id),
  rating: integer('rating').notNull(),
  breakdown: jsonb('breakdown').$type<Record<string, number>>().default({}).notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  orderId: uuid('order_id').references(() => orders.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  readAt: timestamp('read_at'),
}, (table) => [index('notifications_user_idx').on(table.userId)]);

export const adminUsers = pgTable('admin_users', {
  userId: text('user_id').primaryKey().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
