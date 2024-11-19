/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firstName` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Customer` table. All the data in the column will be lost.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `Purchase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseDate` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credit_card` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credit_cvv` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credit_expire` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoice_amt` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoice_tax` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoice_total` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_date` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_id` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PurchaseItem" (
    "purchase_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("purchase_id", "product_id")
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "customer_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Customer" ("createdAt", "email", "password") SELECT "createdAt", "email", "password" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE TABLE "new_Product" (
    "product_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL NOT NULL DEFAULT 0.00,
    "filename" TEXT NOT NULL
);
INSERT INTO "new_Product" ("cost", "description", "filename", "name") SELECT "cost", "description", "filename", "name" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Purchase" (
    "purchase_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "credit_card" INTEGER NOT NULL,
    "credit_expire" INTEGER NOT NULL,
    "credit_cvv" INTEGER NOT NULL,
    "invoice_amt" DECIMAL NOT NULL,
    "invoice_tax" DECIMAL NOT NULL,
    "invoice_total" DECIMAL NOT NULL,
    "order_date" INTEGER NOT NULL
);
DROP TABLE "Purchase";
ALTER TABLE "new_Purchase" RENAME TO "Purchase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
