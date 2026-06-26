# Deployment-Strategien in Kubernetes

## Lernziel

Nach diesem Kapitel können Sie:

-   die drei wichtigsten Deployment-Strategien unterscheiden,
-   den Ablauf eines **Rolling Updates**, **Blue-Green Deployments** und
    **Canary Deployments** beschreiben,
-   entscheiden, welche Strategie für eine bestimmte Anwendung geeignet
    ist.

------------------------------------------------------------------------

# Überblick

  -----------------------------------------------------------------------
  Strategie                  Kurzbeschreibung
  -------------------------- --------------------------------------------
  **Rolling Update**         Alte Pods werden schrittweise durch neue
                             ersetzt.

  **Blue-Green Deployment**  Zwei vollständige Versionen laufen parallel.
                             Der Datenverkehr wird auf die neue Version
                             umgeschaltet.

  **Canary Deployment**      Eine kleine Benutzergruppe erhält zunächst
                             die neue Version. Der Anteil wird
                             schrittweise erhöht.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 1. Rolling Update

## Workflow

``` text
Version 1

Pod 1   Pod 2   Pod 3

        │
        ▼

Pod 1(v2) Pod 2   Pod 3

        │
        ▼

Pod 1(v2) Pod 2(v2) Pod 3

        │
        ▼

Pod 1(v2) Pod 2(v2) Pod 3(v2)
```

Jeder neue Pod ersetzt nach und nach einen alten Pod. Der Service bleibt
unverändert.

### Vorteile

-   Einfach umzusetzen
-   Standardverfahren in Kubernetes
-   Geringer Ressourcenbedarf
-   Automatisches Rollback möglich

### Nachteile

-   Während des Updates laufen kurzzeitig unterschiedliche Versionen.
-   Änderungen müssen kompatibel sein.

### Geeignet für

-   Webanwendungen
-   REST-APIs
-   Microservices
-   Standardanwendungen

------------------------------------------------------------------------

# 2. Blue-Green Deployment

## Workflow

``` text
Benutzer
    │
    ▼
 Service
    │
    ▼
Blue (Version 1)

↓

Green (Version 2) wird parallel bereitgestellt

↓

Tests durchführen

↓

Service wird auf Green umgeschaltet

Benutzer
    │
    ▼
 Service
    │
    ▼
Green (Version 2)
```

### Vorteile

-   Sehr schnelles Rollback
-   Alte Version bleibt erhalten
-   Neue Version kann vollständig getestet werden
-   Nahezu keine Downtime

### Nachteile

-   Doppelte Infrastruktur erforderlich
-   Höherer Ressourcenbedarf
-   Datenbankmigrationen können komplex sein

### Geeignet für

-   Kritische Geschäftsanwendungen
-   Online-Shops
-   Anwendungen mit hoher Verfügbarkeit

------------------------------------------------------------------------

# 3. Canary Deployment

## Workflow

``` text
100 % → Version 1

↓

95 % → Version 1
 5 % → Version 2

↓

Monitoring und Tests

↓

80 % → Version 1
20 % → Version 2

↓

50 % → Version 1
50 % → Version 2

↓

100 % → Version 2
```

### Vorteile

-   Sehr geringes Risiko
-   Probleme werden früh erkannt
-   Benutzerfeedback möglich

### Nachteile

-   Höhere Komplexität
-   Zusätzliche Infrastruktur für Traffic-Steuerung erforderlich

### Geeignet für

-   Große Webplattformen
-   Cloud-Anwendungen
-   SaaS-Lösungen
-   Continuous Delivery

------------------------------------------------------------------------

# Vergleich

  Merkmal                       Rolling Update   Blue-Green     Canary
  ----------------------------- ---------------- -------------- ---------
  Zwei Versionen gleichzeitig   Kurzzeitig       Ja             Ja
  Downtime                      Nein             Nein           Nein
  Rollback                      Gut              Sehr einfach   Einfach
  Ressourcenbedarf              Gering           Hoch           Mittel
  Zusätzliche Infrastruktur     Nein             Häufig         Ja

------------------------------------------------------------------------

# Empfehlung

Für Einsteiger sollte das **Rolling Update** praktisch geübt werden, da
es von Kubernetes direkt unterstützt wird.

**Blue-Green** und **Canary** eignen sich als konzeptionelle
Erweiterung. Beide benötigen in der Praxis häufig zusätzliche
Komponenten (Ingress Controller, Service Mesh oder API-Gateway), um den
Datenverkehr gezielt zwischen mehreren Versionen zu steuern.

------------------------------------------------------------------------

# Merksätze

> **Rolling Update:** Alte Pods werden schrittweise ersetzt.

> **Blue-Green:** Zwei vollständige Versionen laufen parallel. Der
> Service wird umgeschaltet.

> **Canary:** Nur ein kleiner Teil der Benutzer erhält zunächst die neue
> Version. Der Anteil wird anschließend schrittweise erhöht.
