## Background

My father asked for an app to support his store's ordering work. I started this personal Flutter/SQLite project from those requirements, connecting stock checks, orders, deliveries, and payments.

Stock is checked by storage location, while orders are grouped by supplier. Users review messages and send them manually through external apps.

## Data design and development

Each store uses a local SQLite database. Orders retain snapshots of item/supplier information so later reference-data changes do not replace historical values. I also connected Excel import/export and backup/restore.

My father explained the workflow, and I translated it into data and screens. I used AI-generated/suggested code extensively, repeatedly applying, modifying, and integrating the output; I did not independently design every internal part from scratch.

## Current status and next steps

The debug APK built, but the full test suite is not passing. The app was not installed on a real device, used in the store, or distributed externally. It is on hold while I plan to review the database and payment/advance structure.

The same business problem led to MoaOrder, a separate redesign exploring PC/mobile synchronization and self-hosting. A server migration of Baljucall itself has not been completed.
