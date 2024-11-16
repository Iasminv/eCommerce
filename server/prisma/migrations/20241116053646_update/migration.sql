/*
  Warnings:

  - You are about to alter the column `cost` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `String` to `Decimal`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL NOT NULL DEFAULT 0.00,
    "filename" TEXT NOT NULL
);
INSERT INTO "new_Product" ("cost", "description", "filename", "id", "name") SELECT "cost", "description", "filename", "id", "name" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
