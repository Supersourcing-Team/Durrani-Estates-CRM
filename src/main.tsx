import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/app.css";
import { eng, openM, closeM, bump } from "./engine";
import { App } from "./app/App";
import { installEvents } from "./app/events";
import { resetPageStateIfRouteChanged } from "./app/route";
import { bootstrapAuthSession, installAuthOverrides } from "./auth/bootstrap";
import { normalizeAuthDeepLinks } from "./auth/inviteLink";
import { installLeadsApiOverrides } from "./modules/leads/leadsBootstrap";
import { installPropertySalesApiOverrides } from "./modules/deals/propertySalesBootstrap";
import { installApiRouteHydration } from "./modules/apiRouteHydrate";

eng.initState();
eng.resetUI();
installAuthOverrides();
installLeadsApiOverrides();
installPropertySalesApiOverrides();
installEvents();
normalizeAuthDeepLinks();
resetPageStateIfRouteChanged();
installApiRouteHydration();

(window as any).durrani = new Proxy(eng, {
  get: (t, k) => (k === "render" ? bump : t[k as any]),
});
(window as any).durraniUI = { openM, closeM, render: bump };

void bootstrapAuthSession().finally(() => {
  if (!location.hash || location.hash === "#") {
    location.replace(eng.S.session ? `#${eng.homeOf(eng.S.session.role)}` : "#login");
  }
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

