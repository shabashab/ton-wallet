CREATE TYPE "public"."asset_price_type" AS ENUM('jetton', 'ton');--> statement-breakpoint
CREATE TYPE "public"."network_type" AS ENUM('mainnet', 'testnet');--> statement-breakpoint
CREATE TABLE "assets_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "asset_price_type" NOT NULL,
	"contract_address" text,
	"network_type" "network_type" NOT NULL,
	"price" numeric NOT NULL,
	"valid_until" timestamp (3) with time zone NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"telegram_id" integer NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
