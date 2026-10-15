## Overview

Our three-person team split parking sensing, gate control, and central monitoring across three Raspberry Pis. MQTT connected the states and events of a parking model with physical sensors and motors.

## System architecture

```mermaid
flowchart TB
  accTitle: Smart Parking devices and central service
  accDescr: RPi1 publishes parking state and RPi2 publishes gate events to the Mosquitto broker on RPi3. RPi2 also subscribes to lot status. The central subscriber records messages in SQLite for the Flask dashboard.
  subgraph devices["Sensing and control devices"]
    P1["RPi1 · slot sensors / LEDs"]
    P2["RPi2 · gate / buzzer"]
  end
  P1 -->|Slot state · heartbeat| B
  P2 <-->|Gate events / lot status| B
  subgraph central["RPi3 · central service"]
    B["Mosquitto · MQTT broker"] --> S["MQTT subscriber"]
    S --> D[("SQLite · state / events")]
    D --> W["Flask · dashboard / API"]
  end
```

Device control was separate from central storage and display, with MQTT topics providing the integration contract.

## My role · RPi3 central service

Each teammate owned one Raspberry Pi. I handled RPi3, the central node.

- Mosquitto broker and MQTT subscriber
- SQLite state/event storage and the Flask dashboard
- Heartbeats and kernel status interfaces for diagnostics
- Wi-Fi AP and local network integration

Heartbeats let us check connectivity separately from parking state. I exposed diagnostics through the dashboard and /dev and /proc interfaces. Teammates implemented the sensing and gate drivers on RPi1/RPi2.

## Results and limitations

We integrated the physical sensors/motors, all three Raspberry Pis, and the browser dashboard for the course demonstration. This model depends on the central RPi3; real-car-park deployment, recovery, and long-term reliability were not validated.
