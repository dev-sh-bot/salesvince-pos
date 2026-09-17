/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

import "./bootstrap";
import { CommonHelper } from "./helpers/commonHelper";

window.CommonHelper = CommonHelper;

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import "./components/Cart";

import "./components/Purchase";

// SND shell interactions. The existing selectors are intentionally retained so
// page navigation and permission-gated menus continue to work unchanged.
document.addEventListener("DOMContentLoaded", () => {
    // Match the SND tenant breakpoint: below 1024px the sidebar is an
    // off-canvas panel opened from the mobile menu button.
    const isMobile = () => window.matchMedia("(max-width: 1023.98px)").matches;

    document.querySelectorAll(".nav-sidebar .nav-item > .nav-link").forEach((link) => {
        const parent = link.closest(".nav-item");
        const treeview = parent ? parent.querySelector(":scope > .nav-treeview") : null;
        if (!treeview) return;

        link.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const isOpen = parent.classList.contains("menu-open");
            document.querySelectorAll(".nav-sidebar .nav-item.menu-open").forEach((openItem) => {
                if (openItem !== parent) openItem.classList.remove("menu-open");
            });
            parent.classList.toggle("menu-open", !isOpen);
        });
    });

    const closeMobileSidebar = () => document.body.classList.remove("snd-sidebar-open");

    // AdminLTE still owns the legacy selector, so handle it on the button and
    // stop the delegated plugin listener from toggling the shell a second time.
    document.querySelectorAll('[data-widget="pushmenu"]').forEach((toggleButton) => {
        toggleButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (isMobile()) {
                document.body.classList.toggle("snd-sidebar-open");
            } else {
                document.body.classList.toggle("sidebar-collapse");
            }
        });
    });

    document.addEventListener("click", (event) => {
        if (event.target.closest("[data-sidebar-close], [data-sidebar-overlay]")) {
            closeMobileSidebar();
        }
    });

    window.addEventListener("resize", () => {
        if (!isMobile()) closeMobileSidebar();
    });
});
