# Demo mode

The public app includes multiple fictional demo profiles so the live version is understandable without exposing private data.

New visitors start with a neutral empty state. No profile is preselected. The Demo-Modus card highlights the demo action until a visitor explicitly chooses and loads a profile.

## Profiles

### Demo 1 · Aufbau

A starter profile with a smaller portfolio, lower health/life values and early routines.

### Demo 2 · Stabil

A balanced profile with moderate portfolio assets, visible routines, goals and reflection values.

### Demo 3 · Vermögend

A larger portfolio profile with more assets, stronger routines and more advanced goal progress.

## Discipline calibration

The demo profiles simulate fictional activity across a rolling 56-day window. This is important because discipline is calculated from recurring activity history, not only from one or two current values.

## Scope

Demo mode only affects:

```text
modularLifeDashboardPublicData
modularLifeDashboardPublicDemoProfile
```

It does not migrate or overwrite the private dashboard storage key.

## Robust loading

After selecting and loading a demo profile, the app reloads once so sliders, summaries and calculated UI sections initialize from the selected demo data.
