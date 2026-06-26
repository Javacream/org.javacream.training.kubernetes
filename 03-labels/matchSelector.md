# Kubernetes Label Selector – `matchLabels` und `matchExpressions`

## Lernziel

Nach diesem Kapitel können Sie:

* den Unterschied zwischen `matchLabels` und `matchExpressions` erklären,
* einfache und erweiterte Label-Selektoren erstellen,
* die unterstützten Operatoren von `matchExpressions` anwenden,
* entscheiden, wann `matchLabels` ausreicht und wann `matchExpressions` sinnvoll ist.

---

# Label Selector in Kubernetes

Ein **Label Selector** wird verwendet, um Kubernetes-Ressourcen anhand ihrer Labels auszuwählen.

Beispielsweise verwendet ein Deployment einen Label Selector, um die Pods zu finden, die es verwalten soll.

Kubernetes unterstützt zwei Arten von Selektoren:

* **`matchLabels`** – einfacher Vergleich von Schlüssel-Wert-Paaren
* **`matchExpressions`** – erweiterte Filter mit Operatoren

---

# 1. `matchLabels`

`matchLabels` ist die einfachste und am häufigsten verwendete Variante.

## Beispiel

```yaml
selector:
  matchLabels:
    app: web
    environment: production
```

### Bedeutung

```
app = web
UND
environment = production
```

Alle angegebenen Labels müssen übereinstimmen.

---

# 2. `matchExpressions`

Mit `matchExpressions` können komplexere Bedingungen definiert werden.

## Allgemeiner Aufbau

```yaml
selector:
  matchExpressions:
  - key: <Labelname>
    operator: <Operator>
    values:
    - <Wert1>
    - <Wert2>
```

---

# Operator: In

Der Label-Wert muss in der angegebenen Liste enthalten sein.

## Beispiel

```yaml
selector:
  matchExpressions:
  - key: environment
    operator: In
    values:
    - development
    - test
```

### Bedeutung

```
environment = development
ODER
environment = test
```

---

# Operator: NotIn

Der Label-Wert darf nicht in der angegebenen Liste enthalten sein.

## Beispiel

```yaml
selector:
  matchExpressions:
  - key: environment
    operator: NotIn
    values:
    - production
```

### Bedeutung

Alle Pods, deren Label `environment` **nicht** den Wert `production` besitzt.

---

# Operator: Exists

Das Label muss vorhanden sein.

Der Wert spielt dabei keine Rolle.

## Beispiel

```yaml
selector:
  matchExpressions:
  - key: app
    operator: Exists
```

Folgende Labels erfüllen diese Bedingung:

```yaml
app: nginx
```

```yaml
app: webshop
```

```yaml
app: backend
```

---

# Operator: DoesNotExist

Das Label darf nicht vorhanden sein.

## Beispiel

```yaml
selector:
  matchExpressions:
  - key: deprecated
    operator: DoesNotExist
```

Alle Pods ohne das Label `deprecated` werden ausgewählt.

---

# Kombination mehrerer Bedingungen

Mehrere Ausdrücke können kombiniert werden.

```yaml
selector:
  matchExpressions:

  - key: app
    operator: In
    values:
    - webshop

  - key: environment
    operator: In
    values:
    - production

  - key: version
    operator: NotIn
    values:
    - beta
```

### Bedeutung

```
app = webshop
UND
environment = production
UND
version ≠ beta
```

Alle Bedingungen müssen gleichzeitig erfüllt sein.

---

# Kombination von `matchLabels` und `matchExpressions`

Beide Varianten können gemeinsam verwendet werden.

```yaml
selector:

  matchLabels:
    app: webshop

  matchExpressions:

  - key: version
    operator: In
    values:
    - v1
    - v2
```

### Bedeutung

```
app = webshop
UND
(version = v1 ODER version = v2)
```

---

# Übersicht der Operatoren

| Operator       | Bedeutung                                     | Beispiel                             |
| -------------- | --------------------------------------------- | ------------------------------------ |
| `In`           | Wert muss in einer Liste enthalten sein       | `environment In (development, test)` |
| `NotIn`        | Wert darf nicht in einer Liste enthalten sein | `version NotIn (beta)`               |
| `Exists`       | Label muss vorhanden sein                     | `app Exists`                         |
| `DoesNotExist` | Label darf nicht vorhanden sein               | `deprecated DoesNotExist`            |

---

# Vergleich: `matchLabels` vs. `matchExpressions`

| `matchLabels`                           | `matchExpressions`                             |
| --------------------------------------- | ---------------------------------------------- |
| Einfach und übersichtlich               | Flexibler und leistungsfähiger                 |
| Exakte Schlüssel-Wert-Zuordnung         | Unterstützt Operatoren                         |
| Für die meisten Deployments ausreichend | Für komplexe Filter geeignet                   |
| Häufig in Services und Deployments      | Häufig in größeren Clustern oder Spezialfällen |

---

# Empfehlung für die Praxis

Für die meisten Anwendungen genügt `matchLabels`.

Beispiel:

```yaml
selector:
  matchLabels:
    app: webshop
```

Erst wenn komplexere Anforderungen entstehen – beispielsweise mehrere erlaubte Werte oder das Vorhandensein eines Labels – sollte `matchExpressions` verwendet werden.

---

# Zusammenfassung

* Kubernetes unterstützt zwei Arten von Label-Selektoren.
* **`matchLabels`** prüft auf eine exakte Übereinstimmung von Schlüssel und Wert.
* **`matchExpressions`** ermöglicht komplexe Bedingungen mit Operatoren.
* Mehrere Bedingungen werden immer als logisches **UND** ausgewertet.
* `matchLabels` und `matchExpressions` können innerhalb desselben Selectors kombiniert werden.

---

# Merksatz

> **`matchLabels` ist die einfache Standardlösung für die meisten Deployments.**
>
> **`matchExpressions` erweitert den Selector um Operatoren und komplexere Auswahlregeln.**
