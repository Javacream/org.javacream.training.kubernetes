# Rolling Update bei Major-Versionen – Grenzen und Alternativen

## Lernziel

Nach diesem Kapitel können Sie:

* erklären, warum ein Rolling Update nicht in jedem Fall geeignet ist,
* die Auswirkungen inkompatibler Änderungen verstehen,
* geeignete Deployment-Strategien für unterschiedliche Release-Szenarien auswählen.

---

# Funktioniert ein Rolling Update bei einem Major-Release?

Die Antwort lautet:

**Ja – aber nur dann, wenn die Anwendung dafür entwickelt wurde.**

Kubernetes selbst unterscheidet nicht zwischen einer Minor- oder Major-Version.

Für Kubernetes ist jede Änderung zunächst nur eine neue Version eines Containers.

Ein Rolling Update ersetzt daher lediglich nach und nach die laufenden Pods durch neue Pods.

Ob beide Versionen gleichzeitig betrieben werden können, hängt ausschließlich von der Anwendung ab.

---

# Ablauf eines Rolling Updates

Während eines Rolling Updates existieren für kurze Zeit zwei Versionen der Anwendung gleichzeitig.

```text
Zeit

Version 1   Version 1   Version 1

↓

Version 2   Version 1   Version 1

↓

Version 2   Version 2   Version 1

↓

Version 2   Version 2   Version 2
```

Während dieser Übergangsphase verteilt der Service Anfragen sowohl an Version 1 als auch an Version 2.

---

# Wann funktioniert ein Rolling Update problemlos?

Ein Rolling Update eignet sich besonders für:

* Bugfixes
* Sicherheitsupdates
* Minor-Releases
* Erweiterungen mit abwärtskompatiblen Schnittstellen

Beispiele:

```text
1.2.3 → 1.2.4
```

```text
2.5 → 2.6
```

In diesen Fällen bleiben:

* API-Schnittstellen kompatibel
* Datenbankstruktur unverändert
* Benutzersitzungen gültig

Ein Rolling Update kann ohne Unterbrechung durchgeführt werden.

---

# Wann wird ein Rolling Update problematisch?

Probleme entstehen, wenn Version 1 und Version 2 **nicht gleichzeitig betrieben werden können**.

## Beispiel: Änderung einer API

Version 1 liefert folgendes JSON zurück:

```json
{
  "name": "Max"
}
```

Version 2 erwartet dagegen:

```json
{
  "firstname": "Max",
  "lastname": "Mustermann"
}
```

Während des Rollouts können Benutzer bei jeder Anfrage auf unterschiedliche Pods gelangen.

```text
Client
   │
   ▼
Service
   │
   ├── Version 1
   └── Version 2
```

Je nachdem, welche Version antwortet, kann es zu Fehlern kommen.

---

# Beispiel: Datenbankmigration

Ein weiteres Risiko besteht bei Änderungen am Datenbankschema.

Version 1 verwendet beispielsweise:

```sql
users(name)
```

Version 2 erwartet:

```sql
users(firstname, lastname)
```

Während des Rolling Updates greifen beide Versionen gleichzeitig auf dieselbe Datenbank zu.

Sind die Änderungen nicht kompatibel, können Laufzeitfehler oder Dateninkonsistenzen entstehen.

---

# Alternativen zum Rolling Update

## Blue-Green Deployment

Beim Blue-Green Deployment laufen zwei vollständige Versionen parallel.

```text
Blue (Version 1)

Green (Version 2)
```

Die neue Version wird vollständig bereitgestellt und getestet.

Erst danach wird der Service auf die neue Version umgeschaltet.

### Vorteile

* Keine Mischphase
* Schnelles Rollback
* Vorabtests unter realen Bedingungen möglich

---

## Canary Deployment

Beim Canary Deployment erhält zunächst nur ein kleiner Teil der Benutzer die neue Version.

```text
95 % → Version 1

5 % → Version 2
```

Nach erfolgreicher Überwachung wird der Anteil schrittweise erhöht.

### Vorteile

* Geringes Risiko
* Frühes Erkennen von Fehlern
* Benutzerfeedback möglich

---

# Wie lösen professionelle Teams dieses Problem?

Moderne Anwendungen werden häufig so entwickelt, dass Rolling Updates auch bei größeren Änderungen möglich bleiben.

Typische Techniken sind:

* Abwärtskompatible APIs
* Mehrstufige Datenbankmigrationen
* Feature Flags
* Backward- und Forward-Kompatibilität zwischen Versionen

Ein häufiges Vorgehen bei Datenbankänderungen:

1. Neue Datenbankspalten hinzufügen.
2. Alte und neue Version unterstützen beide das neue Schema.
3. Nach erfolgreichem Rollout werden nicht mehr benötigte Spalten entfernt.

Dadurch können beide Versionen während des Rollouts gleichzeitig arbeiten.

---

# Entscheidungshilfe

| Szenario                                              | Empfohlene Strategie                 |
| ----------------------------------------------------- | ------------------------------------ |
| Bugfix oder Patch                                     | ✅ Rolling Update                     |
| Minor-Release                                         | ✅ Rolling Update                     |
| Größere Änderungen mit kompatiblen APIs und Datenbank | ✅ Rolling Update möglich             |
| Major-Release mit inkompatiblen Änderungen            | ⚠️ Blue-Green oder Canary bevorzugen |

---

# Wichtige Erkenntnis

Kubernetes ersetzt lediglich Pods.

Ob ein Rolling Update sicher durchgeführt werden kann, entscheidet nicht Kubernetes, sondern die Anwendung selbst.

Insbesondere folgende Aspekte müssen kompatibel sein:

* API-Schnittstellen
* Datenbankschema
* Benutzersitzungen
* Kommunikationsprotokolle zwischen den Diensten

---

# Merksatz

> **Kubernetes kennt keine Major- oder Minor-Versionen.**
>
> **Ein Rolling Update funktioniert immer technisch – ob es fachlich sinnvoll ist, hängt von der Kompatibilität der Anwendung ab.**
>
> **Sind alte und neue Version nicht gleichzeitig lauffähig, sollten Blue-Green oder Canary Deployment eingesetzt werden.**
