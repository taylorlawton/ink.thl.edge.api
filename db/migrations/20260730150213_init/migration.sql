CREATE TABLE `credit` (
	`key` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`owner_key` text NOT NULL,
	CONSTRAINT `credit_key_pkey` PRIMARY KEY(`key`),
	CONSTRAINT `credit_owner_key_fkey` FOREIGN KEY (`owner_key`) REFERENCES `owner`(`key`) ON DELETE CASCADE,
	CONSTRAINT `credit_title_key` UNIQUE(`owner_key`,`title`)
);
--> statement-breakpoint
CREATE TABLE `environment` (
	`key` text NOT NULL,
	`config` text NOT NULL,
	CONSTRAINT `environment_key_pkey` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`key` text NOT NULL,
	`name` text NOT NULL CONSTRAINT `gallery_name_key` UNIQUE,
	`description` text,
	`visible` integer NOT NULL,
	CONSTRAINT `gallery_key_pkey` PRIMARY KEY(`key`),
	CONSTRAINT "gallery_visible_check" CHECK("visible" IN (0, 1))
);
--> statement-breakpoint
CREATE TABLE `link` (
	`key` text NOT NULL,
	`uri` text NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`style` text,
	`site_key` text,
	CONSTRAINT `link_key_pkey` PRIMARY KEY(`key`),
	CONSTRAINT `link_site_key_fkey` FOREIGN KEY (`site_key`) REFERENCES `site`(`key`) ON DELETE CASCADE,
	CONSTRAINT `link_uri_key` UNIQUE(`uri`,`site_key`),
	CONSTRAINT "link_type_check" CHECK("type" IN ('internal', 'external'))
);
--> statement-breakpoint
CREATE TABLE `owner` (
	`key` text NOT NULL,
	`name` text NOT NULL CONSTRAINT `owner_name_key` UNIQUE,
	`pronouns` text,
	`icon` text,
	CONSTRAINT `owner_key_pkey` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `owner_site` (
	`key` text NOT NULL,
	`uri` text NOT NULL,
	`type` text NOT NULL,
	`owner_key` text NOT NULL,
	`site_key` text NOT NULL,
	CONSTRAINT `owner_site_key_pkey` PRIMARY KEY(`key`),
	CONSTRAINT `owner_site_owner_key_fkey` FOREIGN KEY (`owner_key`) REFERENCES `owner`(`key`) ON DELETE CASCADE,
	CONSTRAINT `owner_site_site_key_fkey` FOREIGN KEY (`site_key`) REFERENCES `site`(`key`) ON DELETE CASCADE,
	CONSTRAINT `owner_site_uri_key` UNIQUE(`uri`,`site_key`),
	CONSTRAINT "owner_site_type_check" CHECK("type" IN ('internal', 'external'))
);
--> statement-breakpoint
CREATE TABLE `photo` (
	`key` text NOT NULL,
	`name` text,
	`uri` text NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`owner_key` text NOT NULL,
	`gallery_key` text,
	CONSTRAINT `photo_key_pkey` PRIMARY KEY(`key`),
	CONSTRAINT `photo_owner_key_fkey` FOREIGN KEY (`owner_key`) REFERENCES `owner`(`key`) ON DELETE CASCADE,
	CONSTRAINT `photo_gallery_key_fkey` FOREIGN KEY (`gallery_key`) REFERENCES `gallery`(`key`) ON DELETE CASCADE,
	CONSTRAINT `photo_uri_key` UNIQUE(`uri`,`gallery_key`),
	CONSTRAINT "photo_visible_check" CHECK("visible" IN (0, 1))
);
--> statement-breakpoint
CREATE TABLE `site` (
	`key` text NOT NULL,
	`name` text NOT NULL CONSTRAINT `site_name_key` UNIQUE,
	`icon` text,
	`style` text,
	CONSTRAINT `site_key_pkey` PRIMARY KEY(`key`)
);
