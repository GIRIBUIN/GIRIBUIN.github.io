## Kokchack

Kokchack is a planned orders and bookkeeping service for small stores. Employees would request items through Android; owners would manage supplier orders, payment records, and ledgers through Android and a PC web application.

The current scope is requirements and data-rule review. Owners would copy order messages into external messaging apps themselves. Payments refer to recording payment facts, not executing bank transfers.

## Earlier prototype — Baljucall

The implementation below belongs to an earlier Flutter/SQLite prototype, not the current Kokchack plan.

My father described his store's ordering workflow. I translated it into stock checks, supplier orders, deliveries, and payment records. Users reviewed and sent messages manually through external apps.

Each store had a local SQLite database. Orders retained item and supplier snapshots; Excel import/export and backup/restore were also connected. I used AI-generated and suggested code extensively, applying, modifying, and integrating it rather than independently designing every internal part.

The preserved debug APK built, but the reviewed suite included 57 failing tests. It was not installed on a real device, used in the store, or distributed externally. These are historical prototype results, not Kokchack implementation or deployment results.
