import { Migration } from '@mikro-orm/migrations';

export class Migration20240516161502 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `addresses` (`address_id` text not null, `user_id` text not null, `address_line_1` text not null, `city` text not null, `state` text not null, `country` text not null, `pincode` text not null, primary key (`address_id`));');

    this.addSql('create table `inventory` (`inventory_id` text not null, `created_at` datetime null, `updated_at` datetime null, primary key (`inventory_id`));');

    this.addSql('create table `inventory_items` (`inventory_item_id` text not null, `product_id` text not null, `attributes` json not null, `created_at` datetime null default 1715520212492, `updated_at` datetime null default 1715520212492, `inventory_inventory_id` text not null, constraint `inventory_items_inventory_inventory_id_foreign` foreign key(`inventory_inventory_id`) references `inventory`(`inventory_id`) on update cascade, primary key (`inventory_item_id`));');
    this.addSql('create index `inventory_items_inventory_inventory_id_index` on `inventory_items` (`inventory_inventory_id`);');

    this.addSql('create table `products` (`product_id` text not null, `name` text not null, `category` text not null, `description` text not null, `price` integer not null, `images` text not null, `videos` text not null, `ratings` json not null, `reviews` text not null, `attributes` json not null, `tags` text not null, `created_at` datetime null default 1715520212512, `updated_at` datetime null default 1715520212513, primary key (`product_id`));');

    this.addSql('create table `user_session` (`session_id` text not null, `user_id` text not null, `login_time` datetime not null, `duration` integer not null, `device_info` json not null, primary key (`session_id`));');

    this.addSql('create table `users` (`user_id` text not null, `username` text not null, `firstname` text not null, `lastname` text not null, `email` text not null, `password` text not null, `phone_number` text not null, `is_verified` integer not null default false, `is_loggedin` integer not null default false, `salt` text not null, `otp` text not null, `date of birth` datetime null, `created_at` datetime null default 1715874884565, `updated_at` datetime null default 1715874884566, `address_address_id` text null, `cart_cart_id` text null, `session_session_id` text null, constraint `users_address_address_id_foreign` foreign key(`address_address_id`) references `addresses`(`address_id`) on delete cascade on update cascade, constraint `users_cart_cart_id_foreign` foreign key(`cart_cart_id`) references `cart`(`cart_id`) on delete cascade on update cascade, constraint `users_session_session_id_foreign` foreign key(`session_session_id`) references `user_session`(`session_id`) on delete cascade on update cascade, primary key (`user_id`));');
    this.addSql('create unique index `users_address_address_id_unique` on `users` (`address_address_id`);');
    this.addSql('create unique index `users_cart_cart_id_unique` on `users` (`cart_cart_id`);');
    this.addSql('create unique index `users_session_session_id_unique` on `users` (`session_session_id`);');

    this.addSql('create table `cart` (`cart_id` text not null, `user_id` text not null, `user_user_id` text not null, `created_at` datetime null, `updated_at` datetime null, constraint `cart_user_user_id_foreign` foreign key(`user_user_id`) references `users`(`user_id`) on update cascade, primary key (`cart_id`));');
    this.addSql('create unique index `cart_user_user_id_unique` on `cart` (`user_user_id`);');

    this.addSql('create table `cart_items` (`cart_item_id` text not null, `product_id` text not null, `quantity` integer not null, `cart_cart_id` text not null, constraint `cart_items_cart_cart_id_foreign` foreign key(`cart_cart_id`) references `cart`(`cart_id`) on update cascade, primary key (`cart_item_id`));');
    this.addSql('create index `cart_items_cart_cart_id_index` on `cart_items` (`cart_cart_id`);');
  }

}
