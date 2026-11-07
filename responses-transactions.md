# Prisma-Konzepte

## 1. Relation Fields und Scalar Fields

Bei einer Beziehung gibt es zwei Arten von Feldern. Das Relation Field zeigt auf das
verknüpfte Objekt, zum Beispiel `createdBy: User`. Das dazugehörige Scalar Field
speichert die Fremdschlüssel-ID, zum Beispiel `createdById: Int`.

Beide werden mit `@relation(fields: [createdById], references: [id])`
verbunden. Die Datenbank kennt nur den Fremdschlüssel, während Prisma zusätzlich das verknüpfte Objekt über das Relation Field bereitstellt. Für die Tasklist braucht jede Aufgabe einen Ersteller und kann optional einen zugewiesenen Benutzer haben.

## 2. Eine-viele-Beziehung

Eine Eine-viele-Beziehung bedeutet, dass ein Datensatz mit mehreren anderen Datensätzen verbunden sein kann. Auf der einen Seite steht dabei ein Listenfeld, zum Beispiel `tasks: Task[]`, auf der vielen Seite ein einzelner Relation-Eintrag.

In der Tasklist kann ein Benutzer mehrere erstellte Aufgaben besitzen. Zudem kann ein Benutzer mehreren Aufgaben zugewiesen sein. Ersteller und Zuordnung werden deshalb jeweils als separate Beziehungen zwischen `User` und `Task` modelliert, damit Prisma sie unterscheiden kann.

## 3. Transaktionen

Eine Transaktion fasst mehrere Datenbankoperationen zu einer gemeinsamen Einheit zusammen. Erst wenn alle Operationen erfolgreich sind, werden die Änderungen dauerhaft gespeichert. Schlägt eine Operation fehl, werden auch die bereits ausgeführten Operationen rückgängig gemacht.

Für die Registrierung ist das wichtig: Benutzer und Profilbild-Aufgabe müssen gemeinsam erstellt werden. Eine verschachtelte Prisma-Operation kann beide Datensätze atomar speichern, oder die Anmeldung wird mit `prisma.$transaction` explizit als Transaktion ausgeführt. So entsteht niemals ein neuer Benutzer ohne zugehörige Aufgabe oder umgekehrt.

## Quellen

- [Prisma: Relational data modeling](https://www.prisma.io/docs/orm/data-modeling/relational-databases)
- [Prisma: Relations and joins](https://www.prisma.io/docs/orm/fundamentals/relations-and-joins)
- [Prisma: Transactions](https://www.prisma.io/docs/orm/fundamentals/transactions)