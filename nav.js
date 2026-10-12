const tabs = document.getElementById("tabs");
const toggleButton = document.getElementById("tabs-toggle");
const mobileNavigation = window.matchMedia("(max-width: 700px)");

function updateNavigationMode() {
  const isMobile = mobileNavigation.matches;
  tabs.classList.remove("mobile-open");
  toggleButton.setAttribute(
    "aria-expanded",
    String(!isMobile && !tabs.classList.contains("collapsed")),
  );
  toggleButton.setAttribute(
    "aria-label",
    isMobile
      ? "Open navigation"
      : tabs.classList.contains("collapsed")
        ? "Expand sidebar"
        : "Collapse sidebar",
  );
}

toggleButton.addEventListener("click", () => {
  if (mobileNavigation.matches) {
    const isOpen = tabs.classList.toggle("mobile-open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
    toggleButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation",
    );
    return;
  }

  const isCollapsed = tabs.classList.toggle("collapsed");
  toggleButton.setAttribute("aria-expanded", String(!isCollapsed));
  toggleButton.setAttribute(
    "aria-label",
    isCollapsed ? "Expand sidebar" : "Collapse sidebar",
  );
});

tabs.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    tabs.classList.remove("mobile-open");
    if (mobileNavigation.matches) {
      toggleButton.setAttribute("aria-expanded", "false");
      toggleButton.setAttribute("aria-label", "Open navigation");
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && tabs.classList.contains("mobile-open")) {
    tabs.classList.remove("mobile-open");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-label", "Open navigation");
    toggleButton.focus();
  }
});

mobileNavigation.addEventListener("change", updateNavigationMode);
updateNavigationMode();
