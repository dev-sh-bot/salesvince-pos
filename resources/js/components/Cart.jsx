import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import Swal from "sweetalert2";
import { sum } from "lodash";
import $ from "jquery";
import select2 from "select2";
import "select2/dist/css/select2.min.css";
import { CommonHelper } from "../helpers/commonHelper";
import SndIcon, { sndIconMarkup } from "./SndIcon";
const imageUrl = `${window.location.origin}/images/srb.jfif`;


if (typeof window !== "undefined") {
    window.$ = window.jQuery = $;
    try {
        if (typeof select2 === "function") {
            select2(window, $);
        }
    } catch (e) { }
}

// ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬
//  Inline style objects
// ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬
const S = {
    posWrapper: {
        display: "flex", height: "calc(100vh - 106px)", gap: "0",
        background: "#f8fafc", overflow: "hidden",
        borderRadius: "16px", boxShadow: "0 4px 24px rgba(15,23,42,0.06)",
    },
    // ''‚''‚¬ Gate screen (branch/counter not yet verified) ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬
    gateScreen: {
        flex: 1, display: "flex", alignItems: "center",
        justifyContent: "center", background: "#f8fafc",
    },
    gateCard: {
        background: "#fff", borderRadius: "24px",
        boxShadow: "0 16px 45px rgba(42, 105, 176, 0.12)",
        padding: "42px 46px", textAlign: "center", maxWidth: "440px", width: "100%",
        border: "1.5px solid #d0e4f5",
    },
    gateIcon: {
        width: "72px", height: "72px", borderRadius: "20px",
        background: "#2a69b0",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px", fontSize: "1.9rem", color: "#fff",
        boxShadow: "0 8px 24px rgba(42, 105, 176, 0.38)",
    },
    gateTitle: { fontSize: "1.35rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px", letterSpacing: "-0.02em" },
    gateSubtitle: { fontSize: "0.85rem", color: "#1a3a5c", marginBottom: "26px", lineHeight: 1.5 },
    gateBranchBadge: {
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: "#f0f6ff", border: "1px solid #d0e4f5", borderRadius: "22px",
        padding: "6px 16px", fontSize: "0.82rem", fontWeight: 500, color: "#2a69b0",
        marginBottom: "22px",
    },
    gateBtn: {
        width: "100%", padding: "14px 0", borderRadius: "14px",
        border: "none", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
        background: "#2a69b0", color: "#fff",
        boxShadow: "0 6px 20px rgba(42, 105, 176, 0.4)", transition: "all 0.15s",
    },
    gateBtnSecondary: {
        width: "100%", padding: "10px 0", borderRadius: "12px",
        border: "1.5px solid #d0e4f5", fontSize: "0.85rem", fontWeight: 500,
        cursor: "pointer", background: "#f0f6ff", color: "#2a69b0",
        marginTop: "10px", transition: "all 0.15s",
    },
    stepIndicator: {
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "8px", marginBottom: "24px",
    },
    stepDot: (active, done) => ({
        width: "32px", height: "32px", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.78rem", fontWeight: 600,
        background: done ? "#2a69b0" : active ? "#2a69b0" : "#f0f6ff",
        color: done || active ? "#fff" : "#2a69b0",
        border: done || active ? "none" : "1.5px solid #d0e4f5",
        boxShadow: active ? "0 0 0 4px rgba(42, 105, 176, 0.25)" : "none",
    }),
    stepLine: {
        flex: 1, height: "2px", background: "linear-gradient(90deg, #2a69b0, #d0e4f5)", maxWidth: "40px",
    },
    // ''‚''‚¬ Cart panel ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬
    cartPanel: {
        width: "320px", minWidth: "300px", background: "#fff",
        display: "flex", flexDirection: "column",
        borderRadius: "16px 0 0 16px", overflow: "hidden",
        borderRight: "1px solid #e2e8f0",
    },
    cartHeader: {
        padding: "16px 18px", background: "#0f172a", color: "#fff",
        fontWeight: 500, fontSize: "0.92rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
    },
    cartHeaderBadge: {
        background: "#2563eb", color: "#fff", borderRadius: "12px",
        fontSize: "0.72rem", padding: "3px 10px", fontWeight: 600,
    },
    cartHeaderMeta: {
        fontSize: "0.72rem", color: "rgba(255,255,255,0.65)",
        display: "flex", alignItems: "center", gap: "6px", marginTop: "4px",
    },
    customerBar: {
        padding: "10px 14px", background: "#f8fafc",
        borderBottom: "1px solid #e2e8f0", display: "flex", gap: "6px",
    },
    customerSelect: {
        flex: 1, fontSize: "0.82rem", border: "1px solid #e2e8f0",
        borderRadius: "10px", padding: "6px 12px",
        color: "#0f172a", background: "#fff", outline: "none",
    },
    cartItemsArea: { flex: 1, overflowY: "auto", padding: "4px 0" },
    cartEmpty: {
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        height: "100%", padding: "30px 20px", color: "#94a3b8", textAlign: "center",
    },
    cartEmptyIcon: { fontSize: "2.8rem", marginBottom: "12px", color: "#cbd5e1" },
    cartEmptyText: { fontSize: "0.84rem", fontWeight: 500, color: "#94a3b8" },
    cartRow: {
        display: "flex", alignItems: "center",
        padding: "10px 14px", gap: "8px",
        borderBottom: "1px solid #f1f5f9", transition: "background 0.12s",
    },
    cartItemName: {
        flex: 1, fontSize: "0.84rem", fontWeight: 600, color: "#0f172a",
        lineHeight: 1.3, minWidth: 0, overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap",
    },
    cartItemPrice: { fontSize: "0.76rem", color: "#2563eb", fontWeight: 600, marginTop: "1px" },
    qtyControl: { display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 },
    qtyBtn: {
        width: "24px", height: "24px", borderRadius: "6px",
        border: "1px solid #e2e8f0", background: "#f8fafc",
        color: "#475569", fontSize: "0.85rem", fontWeight: "500",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", padding: 0, lineHeight: 1,
    },
    qtyInput: {
        width: "36px", height: "24px", textAlign: "center",
        fontSize: "0.8rem", borderRadius: "6px", padding: "1px 3px",
        border: "1px solid #e2e8f0", outline: "none", fontWeight: "600",
    },
    cartItemTotal: {
        fontSize: "0.84rem", fontWeight: 500, color: "#0f172a",
        minWidth: "55px", textAlign: "right", flexShrink: 0,
    },
    removeBtn: {
        background: "#fef2f2", border: "none", color: "#ef4444",
        cursor: "pointer", padding: "4px 6px", borderRadius: "6px",
        fontSize: "0.75rem", flexShrink: 0, transition: "all 0.12s",
    },
    cartFooter: { padding: "14px 16px", background: "#fff", borderTop: "2px solid #f1f5f9" },
    totalsRow: {
        display: "flex", justifyContent: "space-between",
        fontSize: "0.82rem", color: "#64748b", marginBottom: "4px",
    },
    totalsGrand: {
        display: "flex", justifyContent: "space-between",
        fontSize: "1.05rem", fontWeight: 600, color: "#0f172a",
        paddingTop: "10px", borderTop: "1.5px dashed #e2e8f0",
        marginTop: "6px", marginBottom: "14px",
    },
    actionBtns: { display: "flex", gap: "8px" },
    btnCancel: {
        flex: 1, padding: "10px 0",
        background: "#fff", border: "1.5px solid #fee2e2", color: "#ef4444",
        borderRadius: "10px", fontSize: "0.83rem", fontWeight: 600, cursor: "pointer",
    },
    btnCheckout: {
        flex: 2, padding: "10px 0", border: "none", color: "#fff",
        background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
        borderRadius: "10px", fontSize: "0.85rem", fontWeight: 500,
        cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
        letterSpacing: "0.02em",
    },
    // ''‚''‚¬ Products panel ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬
    productsPanel: {
        flex: 1, display: "flex", flexDirection: "column",
        overflow: "hidden", background: "#f8fafc",
    },
    productsTopbar: {
        padding: "12px 16px", background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", gap: "8px", alignItems: "center", flexShrink: 0,
    },
    inputField: {
        flex: 1, fontSize: "0.83rem", border: "1px solid #e2e8f0",
        borderRadius: "10px", padding: "8px 14px",
        color: "#0f172a", background: "#fff", outline: "none",
    },
    inputFieldBarcode: {
        width: "190px", flexShrink: 0, fontSize: "0.82rem",
        border: "1px solid #e2e8f0", borderRadius: "10px",
        padding: "8px 12px", color: "#0f172a", background: "#fff", outline: "none",
    },
    productsGrid: {
        flex: 1, overflowY: "auto", padding: "16px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "12px", alignContent: "start",
    },
    productTile: {
        background: "#fff", border: "1px solid #e2e8f0",
        borderRadius: "14px", padding: "12px 10px 10px",
        cursor: "pointer", textAlign: "center",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: "6px",
        position: "relative", overflow: "hidden", userSelect: "none",
        boxShadow: "0 4px 14px rgba(15,23,42,0.03)",
        transition: "all 0.18s ease",
    },
    productTileImgWrap: {
        width: "68px", height: "68px", borderRadius: "14px",
        overflow: "hidden", background: "#eff6ff", border: "1px solid #dbeafe",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    productTileImg: { width: "100%", height: "100%", objectFit: "cover" },
    productTileName: {
        fontSize: "0.78rem", fontWeight: 500, color: "#0f172a",
        lineHeight: 1.3, maxHeight: "2.6em", overflow: "hidden",
        textOverflow: "ellipsis", display: "-webkit-box",
        WebkitLineClamp: 2, WebkitBoxOrient: "vertical", width: "100%",
    },
    productTileStock: (low) => ({
        fontSize: "0.68rem", fontWeight: 600, padding: "2px 8px",
        borderRadius: "12px",
        background: low ? "#fef2f2" : "#ecfdf5",
        color: low ? "#dc2626" : "#059669",
    }),
    productTilePrice: { fontSize: "0.85rem", fontWeight: 600, color: "#2563eb" },
};

// ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬
//  Cart Component
// ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬
class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // ''‚''‚¬ POS gate state ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬
            gateChecked: false,   // have we fetched /pos-access/status?
            branchVerified: false,
            counterVerified: false,
            activeBranch: null,    // { id, name, code }
            activeCounter: null,    // { id, name, code }
            gateLoading: false,

            // ''‚''‚¬ Cart / product state ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬
            cart: [],
            products: [],
            services: [],
            catalog: [],
            customers: [],
            barcode: "",
            search: "",
            activeFilter: "all",
            taxPercent: window.APP?.tax_enabled ? "8" : "",
            taxAmount: "",
            taxMode: "percent",
            discountPercent: "",
            discountAmount: "",
            discountMode: "percent",
            customer_id: "",
            translations: {},
            hoveredTile: null,
            hoveredRemove: null,
        };

        // gate
        this.checkGateStatus = this.checkGateStatus.bind(this);
        this.showBranchModal = this.showBranchModal.bind(this);
        this.showCounterModal = this.showCounterModal.bind(this);
        this.handleClearSession = this.handleClearSession.bind(this);
        // cart
        this.loadCart = this.loadCart.bind(this);
        this.handleOnChangeBarcode = this.handleOnChangeBarcode.bind(this);
        this.handleScanBarcode = this.handleScanBarcode.bind(this);
        this.handleChangeQty = this.handleChangeQty.bind(this);
        this.handleEmptyCart = this.handleEmptyCart.bind(this);
        this.loadCustomers = this.loadCustomers.bind(this);
        this.initCustomerSelect2 = this.initCustomerSelect2.bind(this);
        this.showAddCustomerModal = this.showAddCustomerModal.bind(this);
        this.loadProducts = this.loadProducts.bind(this);
        this.loadCatalog = this.loadCatalog.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.handleSeach = this.handleSeach.bind(this);
        this.setCustomerId = this.setCustomerId.bind(this);
        this.handleClickSubmit = this.handleClickSubmit.bind(this);
        this.setTaxPercent = this.setTaxPercent.bind(this);
        this.setTaxAmount = this.setTaxAmount.bind(this);
        this.setDiscountPercent = this.setDiscountPercent.bind(this);
        this.setDiscountAmount = this.setDiscountAmount.bind(this);
        this.loadTranslations = this.loadTranslations.bind(this);
        this.showReceipt = this.showReceipt.bind(this);
        this.printReceipt = this.printReceipt.bind(this);
        this.addProductToCart = this.addProductToCart.bind(this);
    }

    componentDidMount() {
        this.checkGateStatus().then(() => {
            this.loadTranslations();
            this.loadCustomers();
            this.loadProducts();
            this.restoreCartOnLoad();
        });
    }

    componentDidUpdate(previousProps, previousState) {
        if (previousState.cart !== this.state.cart) {
            try {
                if (this.state.cart.length) {
                    window.localStorage.setItem("pos_cart", JSON.stringify(this.state.cart));
                } else {
                    window.localStorage.removeItem("pos_cart");
                }
            } catch (error) {
                // Ignore storage restrictions; the server cart remains available.
            }
        }
        if (previousState.customers !== this.state.customers || previousState.customer_id !== this.state.customer_id) {
            this.initCustomerSelect2();
        }
    }

    // ''‚''‚¬ Gate helpers ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬

    /** Check if branch+counter already verified in session. */
    async checkGateStatus() {
        const urls = window.APP?.pos_access;
        if (!urls) {
            // No pos_access config ''‚'' allow through (dev / no branches set up)
            this.setState({ gateChecked: true, branchVerified: true, counterVerified: true });
            return;
        }

        try {
            const res = await axios.get(urls.status);
            this.setState({
                gateChecked: true,
                branchVerified: res.data.branch_verified,
                counterVerified: res.data.counter_verified,
                activeBranch: res.data.branch,
                activeCounter: res.data.counter,
            });
            // Load branch choices before the rest of the POS requests.
            if (!res.data.branch_verified) {
                await this.showBranchModal();
            } else if (!res.data.counter_verified) {
                await this.showCounterModal();
            }
        } catch {
            this.setState({ gateChecked: true, branchVerified: true, counterVerified: true });
        }
    }

    closeActiveSwal() {
        if (typeof Swal !== "undefined") {
            Swal.close();
        }

        document.querySelectorAll('.swal2-container').forEach(el => {
            el.remove();
        });
    }

    injectPosGateStyles() {
        if (document.getElementById("pos-gate-swal-style")) return;

        const style = document.createElement("style");
        style.id = "pos-gate-swal-style";
        style.textContent = `
            .swal2-container.swal2-backdrop-show,
            .swal2-container.swal2-container--has-backdrop,
            div.swal2-container {
                background: #ffffff !important;
                backdrop-filter: none !important;
            }
            .swal2-popup.swal2-pos-gate {
                width: min(450px, 92vw) !important;
                max-width: 450px !important;
                border-radius: 28px !important;
                background: #ffffff !important;
                position: relative !important;
                border: 1.5px solid #d0e4f5 !important;
                box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.07), 0 4px 15px rgba(42, 105, 176, 0.12) !important;
                padding: 2.4rem 2.2rem 2rem !important;
                overflow: visible !important;
            }
            .swal2-popup.swal2-pos-gate .swal2-html-container {
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
            }
            .swal2-popup.swal2-pos-gate .swal2-actions {
                margin-top: 1.8rem !important;
                gap: 0.8rem !important;
                width: 100% !important;
            }
            .swal2-popup.swal2-pos-gate .swal2-confirm,
            .swal2-popup.swal2-pos-gate .swal2-cancel {
                border-radius: 16px !important;
                font-weight: 600 !important;
                font-size: 0.98rem !important;
                padding: 0.95rem 1.6rem !important;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            .swal2-popup.swal2-pos-gate .swal2-confirm {
                background: #2a69b0 !important;
                border: none !important;
                color: #ffffff !important;
                box-shadow: 0 6px 18px rgba(42, 105, 176, 0.28) !important;
                letter-spacing: 0.02em !important;
                width: 100% !important;
            }
            .swal2-popup.swal2-pos-gate .swal2-confirm:hover {
                box-shadow: 0 10px 24px rgba(42, 105, 176, 0.4) !important;
                transform: translateY(-2px) !important;
            }
            .swal2-popup.swal2-pos-gate .swal2-cancel {
                background: #f0f6ff !important;
                border: 1.5px solid #d0e4f5 !important;
                color: #8c733e !important;
            }
            .swal2-popup.swal2-pos-gate .swal2-cancel:hover {
                background: #f5eedf !important;
                color: #1a3a5c !important;
                transform: translateY(-1px) !important;
            }
            .swal2-popup.swal2-pos-gate select,
            .swal2-popup.swal2-pos-gate input {
                transition: all 0.2s ease !important;
            }
            .swal2-popup.swal2-pos-gate select:focus,
            .swal2-popup.swal2-pos-gate input:focus {
                border-color: #2a69b0 !important;
                background: #ffffff !important;
                box-shadow: 0 0 0 4px rgba(42, 105, 176, 0.14) !important;
            }

            /* Select2 Custom POS Gateway Styling */
            .swal2-popup.swal2-pos-gate .select2-container {
                width: 100% !important;
                text-align: left !important;
            }
            .swal2-popup.swal2-pos-gate .select2-container--default .select2-selection--single {
                height: 48px !important;
                border-radius: 16px !important;
                border: 1.5px solid #d0e4f5 !important;
                background: #f0f6ff !important;
                display: flex !important;
                align-items: center !important;
                padding-left: 2.6rem !important;
                padding-right: 1rem !important;
                box-shadow: none !important;
                transition: all 0.2s ease !important;
            }
            .swal2-popup.swal2-pos-gate .select2-container--default.select2-container--open .select2-selection--single,
            .swal2-popup.swal2-pos-gate .select2-container--default.select2-container--focus .select2-selection--single {
                border-color: #2a69b0 !important;
                background: #ffffff !important;
                box-shadow: 0 0 0 4px rgba(42, 105, 176, 0.14) !important;
                outline: none !important;
            }
            .swal2-popup.swal2-pos-gate .select2-container--default .select2-selection--single .select2-selection__rendered {
                color: #1a1a1a !important;
                font-size: 0.95rem !important;
                font-weight: 600 !important;
                line-height: 46px !important;
                padding-left: 0 !important;
            }
            .swal2-popup.swal2-pos-gate .select2-container--default .select2-selection--single .select2-selection__arrow {
                height: 46px !important;
                right: 0.9rem !important;
            }
            .swal2-popup.swal2-pos-gate .select2-container--default .select2-selection--single .select2-selection__arrow b {
                border-color: #2a69b0 transparent transparent transparent !important;
                border-width: 6px 5px 0 5px !important;
            }
            .swal2-popup.swal2-pos-gate .select2-container--default.select2-container--open .select2-selection--single .select2-selection__arrow b {
                border-color: transparent transparent #2a69b0 transparent !important;
                border-width: 0 5px 6px 5px !important;
            }
            .select2-dropdown {
                border-radius: 16px !important;
                border: 1.5px solid #d0e4f5 !important;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08) !important;
                background: #ffffff !important;
                overflow: hidden !important;
                z-index: 99999999 !important;
                padding: 6px !important;
            }
            .select2-results__option {
                border-radius: 10px !important;
                padding: 10px 14px !important;
                font-size: 0.92rem !important;
                font-weight: 600 !important;
                color: #262626 !important;
                margin-bottom: 2px !important;
                transition: all 0.15s ease !important;
            }
            .select2-container--default .select2-results__option--highlighted[aria-selected],
            .select2-container--default .select2-results__option--highlighted[aria-selected]:hover {
                background: #2a69b0 !important;
                color: #ffffff !important;
            }
            .select2-container--default .select2-results__option[aria-selected="true"] {
                background: #f0f6ff !important;
                color: #2a69b0 !important;
                font-weight: 500 !important;
            }
        `;
        // Keep the gate's visual layer aligned with the shared SND tokens.
        style.textContent = style.textContent
            .replaceAll("#2a69b0", "#9786ee")
            .replaceAll("#2563eb", "#9786ee")
            .replaceAll("#1d4ed8", "#806fda")
            .replaceAll("#d0e4f5", "#e1def4")
            .replaceAll("#f0f6ff", "#f0edff")
            .replaceAll("#f5eedf", "#e9e5ff")
            .replaceAll("#8c733e", "#6758bd")
            .replaceAll("#1a3a5c", "#505469")
            .replaceAll("rgba(42, 105, 176", "rgba(151, 134, 238")
            .replaceAll("rgba(42,105,176", "rgba(151,134,238");
        document.head.appendChild(style);
    }

    /** Step 1 ''‚'' Branch selection + password. */
    async showBranchModal() {
        this.closeActiveSwal();
        this.injectPosGateStyles();
        const urls = window.APP?.pos_access;
        if (!urls) return;

        // Fetch branches assigned to user
        let branches = [];
        try {
            const res = await axios.get(urls.branches);
            branches = res.data;
        } catch {
            Swal.fire("Error", "Could not load branches.", "error");
            return;
        }

        if (branches.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "No Branches Assigned",
                text: "You have no branches assigned. Contact your administrator.",
                confirmButtonColor: "#2a69b0",
            });
            return;
        }

        const branchOptions = branches
            .map(b => `<option value="${b.id}">${b.name} (${b.code})</option>`)
            .join("");

        const { value: formValues, isConfirmed } = await Swal.fire({
            title: "",
            html: `
                <div style="text-align:center;padding:0.2rem 0;">
                    <div style="width:68px;height:68px;border-radius:22px;background:#2a69b0;display:inline-flex;align-items:center;justify-content:center;color:#ffffff;font-size:1.65rem;box-shadow:0 8px 24px rgba(42, 105, 176, 0.25);margin-bottom:1.2rem;">
                        ${sndIconMarkup("lock")}
                    </div>

                    <div style="font-size:1.95rem;font-weight:600;color:#1a1a1a;margin:0 0 0.2rem;letter-spacing:-0.03em;">Salevince POS</div>
                    <div style="font-size:0.75rem;letter-spacing:0.18em;color:#2a69b0;text-transform:uppercase;font-weight:500;margin-bottom:1rem;">POINT OF SALE</div>

                    <div style="display:inline-flex;align-items:center;gap:0.55rem;background:rgba(42, 105, 176, 0.1);border:1px solid rgba(42, 105, 176, 0.3);border-radius:20px;padding:0.4rem 1.1rem;margin:0 auto 1.6rem;">
                        <span style="width:8px;height:8px;border-radius:50%;background:#2a69b0;box-shadow:0 0 8px #2a69b0;"></span>
                        <span style="font-size:0.76rem;letter-spacing:0.12em;color:#2a69b0;text-transform:uppercase;font-weight:600;">Branch Access</span>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:1.2rem;text-align:left;max-width:370px;margin:0 auto;">
                        <div>
                            <label style="display:flex;align-items:center;gap:7px;font-size:0.84rem;font-weight:500;color:#262626;margin-bottom:0.5rem;">
                                Select Branch
                            </label>
                            <div style="position:relative;width:100%;">
                                ${sndIconMarkup("building-2", { style: "position:absolute;left:1.1rem;top:50%;transform:translateY(-50%);color:#2a69b0;font-size:0.95rem;pointer-events:none;z-index:10;" })}
                                <select id="swal-branch" style="width:100%;padding:0.85rem 2.5rem 0.85rem 2.8rem;border:1.5px solid #d0e4f5;border-radius:16px;font-size:0.95rem;font-weight:600;outline:none;background:#f0f6ff;color:#1a1a1a;appearance:none;-webkit-appearance:none;cursor:pointer;box-sizing:border-box;transition:all 0.2s ease;">
                                    ${branchOptions}
                                </select>
                                ${sndIconMarkup("chevron-down", { id: "swal-branch-arrow", style: "position:absolute;right:1.1rem;top:50%;transform:translateY(-50%);color:#2a69b0;pointer-events:none;font-size:0.85rem;z-index:3;" })}
                            </div>
                        </div>

                        <div>
                            <label style="display:flex;align-items:center;gap:7px;font-size:0.84rem;font-weight:500;color:#262626;margin-bottom:0.5rem;">
                                Branch Password
                            </label>
                            <div style="position:relative;width:100%;">
                                ${sndIconMarkup("key", { style: "position:absolute;left:1.1rem;top:50%;transform:translateY(-50%);color:#2a69b0;font-size:0.95rem;pointer-events:none;z-index:2;" })}
                                <input id="swal-branch-pass" type="password"
                                       placeholder="Enter branch password"
                                       style="width:100%;padding:0.85rem 2.8rem 0.85rem 2.8rem;border:1.5px solid #d0e4f5;border-radius:16px;font-size:0.95rem;font-weight:600;outline:none;background:#f0f6ff;color:#1a1a1a;box-sizing:border-box;"
                                       autocomplete="off">
                                <button type="button" id="swal-pass-toggle" style="position:absolute;right:0.9rem;top:50%;transform:translateY(-50%);background:none;border:none;color:#2a69b0;cursor:pointer;font-size:0.95rem;padding:4px;display:flex;align-items:center;justify-content:center;z-index:2;">
                                    ${sndIconMarkup("eye", { id: "swal-pass-toggle-icon" })}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`,
            showCancelButton: false,
            confirmButtonText: "Verify Branch",
            confirmButtonColor: "#2a69b0",
            allowOutsideClick: false,
            allowEscapeKey: false,
            focusConfirm: false,
            showLoaderOnConfirm: true,
            customClass: { popup: "swal2-pos-gate" },
            didOpen: () => {
                const toggleBtn = document.getElementById("swal-pass-toggle");
                const passInput = document.getElementById("swal-branch-pass");
                let icon = document.getElementById("swal-pass-toggle-icon");
                if (toggleBtn && passInput && icon) {
                    toggleBtn.addEventListener("click", () => {
                        if (passInput.type === "password") {
                            passInput.type = "text";
                            icon.outerHTML = sndIconMarkup("eye-off", { id: "swal-pass-toggle-icon" });
                            icon = document.getElementById("swal-pass-toggle-icon");
                            toggleBtn.style.color = "#2a69b0";
                        } else {
                            passInput.type = "password";
                            icon.outerHTML = sndIconMarkup("eye", { id: "swal-pass-toggle-icon" });
                            icon = document.getElementById("swal-pass-toggle-icon");
                            toggleBtn.style.color = "#2a69b0";
                        }
                    });
                }

                const runInit = () => {
                    try {
                        if (typeof $.fn?.select2 !== 'function' && typeof select2 === 'function') {
                            select2(window, $);
                        }
                        const $select = $('#swal-branch');
                        if ($select.length && typeof $.fn?.select2 === 'function') {
                            if (!$select.hasClass('select2-hidden-accessible')) {
                                $select.select2({
                                    dropdownParent: $('.swal2-popup.swal2-pos-gate'),
                                    minimumResultsForSearch: Infinity,
                                    width: '100%'
                                });
                                const arrow = document.getElementById("swal-branch-arrow");
                                if (arrow) arrow.style.display = "none";
                            }
                        }
                    } catch (e) {
                        console.error("Select2 init error:", e);
                    }
                };

                setTimeout(runInit, 20);
                setTimeout(runInit, 120);
            },
            preConfirm: async () => {
                const branch_id = document.getElementById("swal-branch").value;
                const password = document.getElementById("swal-branch-pass").value;

                if (!password) {
                    Swal.showValidationMessage("Please enter the branch password.");
                    return false;
                }

                try {
                    const res = await axios.post(urls.verify_branch, { branch_id, password });
                    return res.data;
                } catch (err) {
                    Swal.showValidationMessage(
                        err.response?.data?.message || "Incorrect password."
                    );
                    return false;
                }
            },
        });

        if (isConfirmed && formValues) {
            this.setState({ branchVerified: true, activeBranch: formValues.branch });
            await this.showCounterModal();
        }
    }

    /** Step 2 ''‚'' Counter selection + password. */
    async showCounterModal() {
        this.closeActiveSwal();
        this.injectPosGateStyles();
        const urls = window.APP?.pos_access;
        if (!urls) return;

        let counters = [];
        try {
            const res = await axios.get(urls.counters);
            counters = res.data;
        } catch {
            Swal.fire("Error", "Could not load counters.", "error");
            return;
        }

        if (counters.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "No Counters Assigned",
                text: "You have no counters assigned to this branch. Contact your administrator.",
                confirmButtonColor: "#2a69b0",
            });
            return;
        }

        const counterOptions = counters
            .map(c => `<option value="${c.id}">${c.name} (${c.code})</option>`)
            .join("");

        const { value: formValues, isConfirmed } = await Swal.fire({
            title: "",
            html: `
                <div style="text-align:center;padding:0.2rem 0;">
                    <div style="width:68px;height:68px;border-radius:22px;background:#2a69b0;display:inline-flex;align-items:center;justify-content:center;color:#ffffff;font-size:1.65rem;box-shadow:0 8px 24px rgba(42, 105, 176, 0.25);margin-bottom:1.2rem;">
                        ${sndIconMarkup("lock")}
                    </div>

                    <div style="font-size:1.95rem;font-weight:600;color:#1a1a1a;margin:0 0 0.2rem;letter-spacing:-0.03em;">Salevince POS</div>
                    <div style="font-size:0.75rem;letter-spacing:0.18em;color:#2a69b0;text-transform:uppercase;font-weight:500;margin-bottom:1rem;">POINT OF SALE</div>

                    <div style="display:inline-flex;align-items:center;gap:0.55rem;background:rgba(42, 105, 176, 0.1);border:1px solid rgba(42, 105, 176, 0.3);border-radius:20px;padding:0.4rem 1.1rem;margin:0 auto 1.6rem;">
                        <span style="width:8px;height:8px;border-radius:50%;background:#2a69b0;box-shadow:0 0 8px #2a69b0;"></span>
                        <span style="font-size:0.76rem;letter-spacing:0.12em;color:#2a69b0;text-transform:uppercase;font-weight:600;">Counter Access</span>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:1.2rem;text-align:left;max-width:370px;margin:0 auto;">
                        <div>
                            <label style="display:flex;align-items:center;gap:7px;font-size:0.84rem;font-weight:500;color:#262626;margin-bottom:0.5rem;">
                                Select Counter
                            </label>
                            <div style="position:relative;width:100%;">
                                ${sndIconMarkup("receipt", { style: "position:absolute;left:1.1rem;top:50%;transform:translateY(-50%);color:#2a69b0;font-size:0.95rem;pointer-events:none;z-index:10;" })}
                                <select id="swal-counter" style="width:100%;padding:0.85rem 2.5rem 0.85rem 2.8rem;border:1.5px solid #d0e4f5;border-radius:16px;font-size:0.95rem;font-weight:600;outline:none;background:#f0f6ff;color:#1a1a1a;appearance:none;-webkit-appearance:none;cursor:pointer;box-sizing:border-box;transition:all 0.2s ease;">
                                    ${counterOptions}
                                </select>
                                ${sndIconMarkup("chevron-down", { id: "swal-counter-arrow", style: "position:absolute;right:1.1rem;top:50%;transform:translateY(-50%);color:#2a69b0;pointer-events:none;font-size:0.85rem;z-index:3;" })}
                            </div>
                        </div>

                        <div>
                            <label style="display:flex;align-items:center;gap:7px;font-size:0.84rem;font-weight:500;color:#262626;margin-bottom:0.5rem;">
                                Counter Password
                            </label>
                            <div style="position:relative;width:100%;">
                                ${sndIconMarkup("key", { style: "position:absolute;left:1.1rem;top:50%;transform:translateY(-50%);color:#2a69b0;font-size:0.95rem;pointer-events:none;z-index:2;" })}
                                <input id="swal-counter-pass" type="password"
                                       placeholder="Enter counter password"
                                       style="width:100%;padding:0.85rem 2.8rem 0.85rem 2.8rem;border:1.5px solid #d0e4f5;border-radius:16px;font-size:0.95rem;font-weight:600;outline:none;background:#f0f6ff;color:#1a1a1a;box-sizing:border-box;"
                                       autocomplete="off">
                                <button type="button" id="swal-pass-toggle" style="position:absolute;right:0.9rem;top:50%;transform:translateY(-50%);background:none;border:none;color:#2a69b0;cursor:pointer;font-size:0.95rem;padding:4px;display:flex;align-items:center;justify-content:center;z-index:2;">
                                    ${sndIconMarkup("eye", { id: "swal-pass-toggle-icon" })}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`,
            showCancelButton: true,
            cancelButtonText: "Back to Branch",
            confirmButtonText: "Open POS",
            confirmButtonColor: "#2a69b0",
            allowOutsideClick: false,
            allowEscapeKey: false,
            focusConfirm: false,
            showLoaderOnConfirm: true,
            customClass: { popup: "swal2-pos-gate" },
            didOpen: () => {
                const toggleBtn = document.getElementById("swal-pass-toggle");
                const passInput = document.getElementById("swal-counter-pass");
                let icon = document.getElementById("swal-pass-toggle-icon");
                if (toggleBtn && passInput && icon) {
                    toggleBtn.addEventListener("click", () => {
                        if (passInput.type === "password") {
                            passInput.type = "text";
                            icon.outerHTML = sndIconMarkup("eye-off", { id: "swal-pass-toggle-icon" });
                            icon = document.getElementById("swal-pass-toggle-icon");
                            toggleBtn.style.color = "#2a69b0";
                        } else {
                            passInput.type = "password";
                            icon.outerHTML = sndIconMarkup("eye", { id: "swal-pass-toggle-icon" });
                            icon = document.getElementById("swal-pass-toggle-icon");
                            toggleBtn.style.color = "#2a69b0";
                        }
                    });
                }

                const runInit = () => {
                    try {
                        if (typeof $.fn?.select2 !== 'function' && typeof select2 === 'function') {
                            select2(window, $);
                        }
                        const $select = $('#swal-counter');
                        if ($select.length && typeof $.fn?.select2 === 'function') {
                            if (!$select.hasClass('select2-hidden-accessible')) {
                                $select.select2({
                                    dropdownParent: $('.swal2-popup.swal2-pos-gate'),
                                    minimumResultsForSearch: Infinity,
                                    width: '100%'
                                });
                                const arrow = document.getElementById("swal-counter-arrow");
                                if (arrow) arrow.style.display = "none";
                            }
                        }
                    } catch (e) {
                        console.error("Select2 init error:", e);
                    }
                };

                setTimeout(runInit, 20);
                setTimeout(runInit, 120);
            },
            preConfirm: async () => {
                const counter_id = document.getElementById("swal-counter").value;
                const password = document.getElementById("swal-counter-pass").value;

                if (!password) {
                    Swal.showValidationMessage("Please enter the counter password.");
                    return false;
                }

                try {
                    const res = await axios.post(urls.verify_counter, { counter_id, password });
                    return res.data;
                } catch (err) {
                    Swal.showValidationMessage(
                        err.response?.data?.message || "Incorrect password."
                    );
                    return false;
                }
            },
        });

        if (isConfirmed && formValues) {
            this.setState({ counterVerified: true, activeCounter: formValues.counter });
        } else if (!isConfirmed) {
            // Clicked "back to branch" ''‚'' restart branch selection
            await axios.post(window.APP.pos_access.clear).catch(() => { });
            this.setState({ branchVerified: false, activeBranch: null });
            this.showBranchModal();
        }
    }

    /** Clear session and force re-verification. */
    handleClearSession() {
        Swal.fire({
            title: "Switch Branch/Counter?",
            text: "This will clear your current POS session and ask you to re-enter passwords.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, switch",
            confirmButtonColor: "#ef4444",
            cancelButtonText: "Cancel",
        }).then(async res => {
            if (res.isConfirmed) {
                await axios.post(window.APP.pos_access.clear).catch(() => { });
                this.setState({
                    branchVerified: false, counterVerified: false,
                    activeBranch: null, activeCounter: null,
                });
                this.showBranchModal();
            }
        });
    }

    // ''‚''‚¬ Cart / product methods (unchanged) ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬

    loadTranslations() {
        axios.get(window.APP.locale_cart_url)
            .then(res => this.setState({ translations: res.data }))
            .catch(() => this.setState({ translations: {} }));
    }

    loadCustomers() {
        axios.get("/admin/customers", { headers: { Accept: "application/json" } })
            .then(res => {
                const customers = Array.isArray(res.data) ? res.data : [];
                this.setState({ customers }, () => this.initCustomerSelect2());
            })
            .catch(() => this.setState({ customers: [] }));
    }

    initCustomerSelect2() {
        setTimeout(() => {
            if (typeof $ !== "undefined" && typeof $.fn?.select2 === "function") {
                const $el = $("#pos-customer-select");
                if ($el.length) {
                    if ($el.hasClass("select2-hidden-accessible")) {
                        $el.select2("destroy");
                    }
                    $el.select2({
                        placeholder: "Search / Select Customer...",
                        allowClear: true,
                        width: "100%"
                    }).off("change.posCust").on("change.posCust", (e) => {
                        this.setState({ customer_id: e.target.value });
                    });
                }
            }
        }, 50);
    }

    async showAddCustomerModal() {
        const { value: formValues } = await Swal.fire({
            title: "",
            html: `
                <div style="text-align:center;padding:0.2rem 0 0.5rem;">
                    <div style="width:60px;height:60px;border-radius:20px;background:#2a69b0;display:inline-flex;align-items:center;justify-content:center;color:#ffffff;font-size:1.5rem;box-shadow:0 8px 22px rgba(42, 105, 176, 0.3);margin-bottom:0.8rem;">
                        ${sndIconMarkup("user-plus")}
                    </div>
                    <div style="font-size:1.45rem;font-weight:600;color:#1a1a1a;margin-bottom:0.2rem;letter-spacing:-0.02em;">Create New Customer</div>
                    <div style="font-size:0.8rem;color:#64748b;margin-bottom:1.2rem;font-weight:500;">Add customer details for quick POS checkout</div>

                    <div style="text-align:left;display:flex;flex-direction:column;gap:0.9rem;max-width:380px;margin:0 auto;">
                        <div>
                            <label style="font-weight:500;font-size:0.82rem;color:#262626;margin-bottom:0.35rem;display:flex;align-items:center;justify-content:space-between;">
                                <span>First Name <span style="color:#2a69b0;">*</span></span>
                                <span style="font-size:0.7rem;color:#2a69b0;font-weight:600;">Required</span>
                            </label>
                            <div style="position:relative;width:100%;">
                                ${sndIconMarkup("user", { style: "position:absolute;left:1.1rem;top:50%;transform:translateY(-50%);color:#2a69b0;font-size:0.9rem;pointer-events:none;z-index:2;" })}
                                <input id="swal-cust-first" type="text" placeholder="e.g. Ayesha"
                                       style="width:100%;padding:0.75rem 1rem 0.75rem 2.7rem;border:1.5px solid #d0e4f5;border-radius:14px;font-size:0.9rem;font-weight:600;outline:none;background:#f0f6ff;color:#1a1a1a;box-sizing:border-box;transition:all 0.2s ease;"
                                       autocomplete="off">
                            </div>
                        </div>

                        <div>
                            <label style="font-weight:500;font-size:0.82rem;color:#262626;margin-bottom:0.35rem;display:block;">
                                Last Name <span style="font-size:0.72rem;color:#94a3b8;font-weight:500;">(Optional)</span>
                            </label>
                            <div style="position:relative;width:100%;">
                                ${sndIconMarkup("user", { style: "position:absolute;left:1.1rem;top:50%;transform:translateY(-50%);color:#2a69b0;font-size:0.9rem;pointer-events:none;z-index:2;" })}
                                <input id="swal-cust-last" type="text" placeholder="e.g. Khan"
                                       style="width:100%;padding:0.75rem 1rem 0.75rem 2.7rem;border:1.5px solid #d0e4f5;border-radius:14px;font-size:0.9rem;font-weight:600;outline:none;background:#f0f6ff;color:#1a1a1a;box-sizing:border-box;transition:all 0.2s ease;"
                                       autocomplete="off">
                            </div>
                        </div>

                        <div>
                            <label style="font-weight:500;font-size:0.82rem;color:#262626;margin-bottom:0.35rem;display:block;">
                                Phone Number <span style="font-size:0.72rem;color:#94a3b8;font-weight:500;">(Optional)</span>
                            </label>
                            <div style="position:relative;width:100%;">
                                ${sndIconMarkup("phone", { style: "position:absolute;left:1.1rem;top:50%;transform:translateY(-50%);color:#2a69b0;font-size:0.9rem;pointer-events:none;z-index:2;" })}
                                <input id="swal-cust-phone" type="text" placeholder="e.g. +92 300 1234567"
                                       style="width:100%;padding:0.75rem 1rem 0.75rem 2.7rem;border:1.5px solid #d0e4f5;border-radius:14px;font-size:0.9rem;font-weight:600;outline:none;background:#f0f6ff;color:#1a1a1a;box-sizing:border-box;transition:all 0.2s ease;"
                                       autocomplete="off">
                            </div>
                        </div>

                        <div>
                            <label style="font-weight:500;font-size:0.82rem;color:#262626;margin-bottom:0.35rem;display:block;">
                                Email Address <span style="font-size:0.72rem;color:#94a3b8;font-weight:500;">(Optional)</span>
                            </label>
                            <div style="position:relative;width:100%;">
                                ${sndIconMarkup("mail", { style: "position:absolute;left:1.1rem;top:50%;transform:translateY(-50%);color:#2a69b0;font-size:0.9rem;pointer-events:none;z-index:2;" })}
                                <input id="swal-cust-email" type="email" placeholder="e.g. ayesha@example.com"
                                       style="width:100%;padding:0.75rem 1rem 0.75rem 2.7rem;border:1.5px solid #d0e4f5;border-radius:14px;font-size:0.9rem;font-weight:600;outline:none;background:#f0f6ff;color:#1a1a1a;box-sizing:border-box;transition:all 0.2s ease;"
                                       autocomplete="off">
                            </div>
                        </div>

                        <div>
                            <label style="font-weight:500;font-size:0.82rem;color:#262626;margin-bottom:0.35rem;display:block;">
                                Address <span style="font-size:0.72rem;color:#94a3b8;font-weight:500;">(Optional)</span>
                            </label>
                            <div style="position:relative;width:100%;">
                                ${sndIconMarkup("map-pin", { style: "position:absolute;left:1.1rem;top:50%;transform:translateY(-50%);color:#2a69b0;font-size:0.9rem;pointer-events:none;z-index:2;" })}
                                <input id="swal-cust-address" type="text" placeholder="e.g. Clifton Block 5, Karachi"
                                       style="width:100%;padding:0.75rem 1rem 0.75rem 2.7rem;border:1.5px solid #d0e4f5;border-radius:14px;font-size:0.9rem;font-weight:600;outline:none;background:#f0f6ff;color:#1a1a1a;box-sizing:border-box;transition:all 0.2s ease;"
                                       autocomplete="off">
                            </div>
                        </div>
                    </div>
                </div>
            `,

            showCancelButton: true,
            confirmButtonText: "Save & Select Customer",
            confirmButtonColor: "#2a69b0",
            cancelButtonText: "Cancel",
            focusConfirm: false,
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                const first_name = document.getElementById("swal-cust-first").value.trim();
                const last_name = document.getElementById("swal-cust-last").value.trim();
                const phone = document.getElementById("swal-cust-phone").value.trim();
                const email = document.getElementById("swal-cust-email").value.trim();
                const address = document.getElementById("swal-cust-address").value.trim();

                if (!first_name) {
                    Swal.showValidationMessage("First Name is required!");
                    return false;
                }

                try {
                    const res = await axios.post("/admin/customers", {
                        first_name, last_name, phone, email, address
                    }, {
                        headers: { Accept: "application/json" }
                    });
                    return res.data;
                } catch (err) {
                    const msg = err.response?.data?.message || err.response?.data?.errors?.first_name?.[0] || "Could not create customer.";
                    Swal.showValidationMessage(msg);
                    return false;
                }
            }
        });

        if (formValues && formValues.customer) {
            const newCust = formValues.customer;
            this.setState(prevState => ({
                customers: [newCust, ...prevState.customers],
                customer_id: newCust.id
            }), () => this.initCustomerSelect2());

            const fullName = [newCust.first_name, newCust.last_name].filter(Boolean).join(" ");
            Swal.fire({
                icon: "success",
                title: "Customer Selected!",
                text: `${fullName} has been created & selected.`,
                confirmButtonColor: "#2a69b0",
                timer: 2000
            });
        }
    }

    loadProducts(search = "") {
        this.loadCatalog(search);
    }

    loadCatalog(search = "") {
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const showProducts = !!(window.APP?.show_products !== false);
        const showServices = !!window.APP?.show_services;

        const productRequest = showProducts
            ? axios.get(`/admin/products${query}`, { headers: { Accept: "application/json" } })
            : Promise.resolve({ data: { data: [] } });

        const serviceRequest = showServices
            ? axios.get(`/admin/services${query}`, { headers: { Accept: "application/json" } })
            : Promise.resolve({ data: { data: [] } });

        Promise.all([productRequest, serviceRequest])
            .then(([productRes, serviceRes]) => {
                const products = Array.isArray(productRes.data.data) ? productRes.data.data.map(item => ({ ...item, item_type: 'product' })) : [];
                const services = Array.isArray(serviceRes.data.data) ? serviceRes.data.data.map(item => ({ ...item, item_type: 'service', price: Number(item.rate ?? item.price ?? 0), quantity: Number.POSITIVE_INFINITY })) : [];
                this.setState({ products, services, catalog: [...products, ...services] });
            })
            .catch(() => this.setState({ products: [], services: [], catalog: [] }));
    }

    loadCart() {
        axios.get("/admin/cart", { headers: { Accept: "application/json" } })
            .then(res => this.setState({ cart: Array.isArray(res.data) ? res.data : [] }))
            .catch(() => this.setState({ cart: [] }));
    }

    restoreCartOnLoad() {
        let savedCart = [];
        try {
            savedCart = JSON.parse(window.localStorage.getItem("pos_cart") || "[]");
            if (!Array.isArray(savedCart)) savedCart = [];
        } catch (error) {
            savedCart = [];
        }

        axios.post("/admin/cart/empty", { _method: "DELETE" })
            .then(() => {
                const restoreRequests = savedCart.flatMap(item => {
                    const quantity = Math.max(1, Number(item.pivot?.quantity || 1));
                    return Array.from({ length: quantity }, () => axios.post("/admin/cart", { barcode: item.barcode }));
                });

                return Promise.all(restoreRequests).then(() => {
                    if (savedCart.length) {
                        this.setState({ cart: savedCart });
                    } else {
                        this.resetSaleAdjustments();
                    }
                });
            })
            .catch(() => this.resetSaleAdjustments());
    }

    resetSaleAdjustments() {
        this.setState({
            cart: [],
            taxPercent: window.APP?.tax_enabled ? "8" : "",
            taxAmount: "",
            taxMode: "percent",
            discountPercent: "",
            discountAmount: "",
            discountMode: "percent",
        });
        try {
            window.localStorage.removeItem("pos_cart");
        } catch (error) {
            // Ignore storage restrictions.
        }
    }

    handleOnChangeBarcode(e) { this.setState({ barcode: e.target.value }); }

    handleScanBarcode(e) {
        e.preventDefault();
        const { barcode } = this.state;
        if (!barcode) return;
        axios.post("/admin/cart", { barcode })
            .then(() => { this.loadCart(); this.setState({ barcode: "" }); })
            .catch(err => Swal.fire("Error!", err.response?.data?.message || "Failed", "error"));
    }

    getCartItemKey(item) {
        return `${item.item_type || "product"}:${item.id}`;
    }

    handleChangeQty(product_id, qty) {
        const cart = this.state.cart.map(c => {
            if (this.getCartItemKey(c) === this.getCartItemKey({ item_type: product_id.includes(':') ? product_id.split(':')[0] : 'product', id: Number(product_id.split(':')[1] ?? product_id) })) c.pivot.quantity = qty;
            return c;
        });
        this.setState({ cart });
        if (!qty) return;
        axios.post("/admin/cart/change-qty", { product_id, quantity: qty })
            .catch(err => Swal.fire("Error!", err.response?.data?.message || "Failed", "error"));
    }

    getTotal(cart) {
        return sum(cart.map(c => c.pivot.quantity * Number(c.price ?? c.rate ?? 0))).toFixed(2);
    }

    getSaleTotals(cart = this.state.cart) {
        const subtotal = Number(this.getTotal(cart));
        const taxPercent = Number(this.state.taxPercent) || 0;
        const discountPercent = Number(this.state.discountPercent) || 0;
        const taxAmount = this.state.taxMode === "amount"
            ? Number(this.state.taxAmount) || 0
            : subtotal * taxPercent / 100;
        const discountAmount = this.state.discountMode === "amount"
            ? Number(this.state.discountAmount) || 0
            : subtotal * discountPercent / 100;

        return {
            subtotal,
            taxPercent,
            taxAmount,
            discountPercent,
            discountAmount,
            total: Math.max(0, subtotal + taxAmount - discountAmount),
        };
    }

    setTaxPercent(event) {
        const taxPercent = Number(event.target.value) || 0;
        const subtotal = Number(this.getTotal(this.state.cart));
        this.setState({ taxPercent: event.target.value, taxAmount: (subtotal * taxPercent / 100).toFixed(2), taxMode: "percent" });
    }

    setTaxAmount(event) {
        const taxAmount = Number(event.target.value) || 0;
        const subtotal = Number(this.getTotal(this.state.cart));
        this.setState({ taxAmount: event.target.value, taxPercent: subtotal ? (taxAmount / subtotal * 100).toFixed(2) : "0.00", taxMode: "amount" });
    }

    setDiscountPercent(event) {
        const discountPercent = Number(event.target.value) || 0;
        const subtotal = Number(this.getTotal(this.state.cart));
        this.setState({ discountPercent: event.target.value, discountAmount: (subtotal * discountPercent / 100).toFixed(2), discountMode: "percent" });
    }

    setDiscountAmount(event) {
        const discountAmount = Number(event.target.value) || 0;
        const subtotal = Number(this.getTotal(this.state.cart));
        this.setState({ discountAmount: event.target.value, discountPercent: subtotal ? (discountAmount / subtotal * 100).toFixed(2) : "0.00", discountMode: "amount" });
    }

    handleClickDelete(product_id) {
        const itemKey = String(product_id);
        axios.post("/admin/cart/delete", { product_id: itemKey, _method: "DELETE" })
            .then(() => this.setState({ cart: this.state.cart.filter(c => this.getCartItemKey(c) !== itemKey) }));
    }

    handleEmptyCart() {
        Swal.fire({
            title: "Clear cart?", text: "All items will be removed.",
            icon: "warning", showCancelButton: true,
            confirmButtonText: "Yes, clear", confirmButtonColor: "#ef4444",
        }).then(result => {
            if (result.isConfirmed) {
                axios.post("/admin/cart/empty", { _method: "DELETE" })
                    .then(() => this.resetSaleAdjustments());
            }
        });
    }

    handleChangeSearch(e) {
        this.setState({ search: e.target.value });
        clearTimeout(this._searchTimer);
        this._searchTimer = setTimeout(() => this.loadProducts(e.target.value), 350);
    }

    handleSeach(e) {
        if (e.keyCode === 13) { clearTimeout(this._searchTimer); this.loadProducts(e.target.value); }
    }

    addProductToCart(barcode) {
        const catalogItem = [...this.state.products, ...this.state.services].find(item => item.barcode === barcode);
        if (!catalogItem) return;

        const itemType = catalogItem.item_type || "product";
        const itemKey = `${itemType}:${catalogItem.id}`;
        const inCart = this.state.cart.find(c => this.getCartItemKey(c) === itemKey);

        if (inCart) {
            this.setState({
                cart: this.state.cart.map(c => {
                    if (this.getCartItemKey(c) === itemKey && (c.quantity === Number.POSITIVE_INFINITY || c.quantity > c.pivot.quantity)) c.pivot.quantity += 1;
                    return c;
                }),
            });
        } else {
            if (itemType === "product" && Number(catalogItem.quantity) <= 0) {
                Swal.fire({ icon: "warning", title: "Out of stock", text: catalogItem.name, timer: 1800, showConfirmButton: false });
                return;
            }
            const newItem = {
                ...catalogItem,
                price: Number(catalogItem.price ?? catalogItem.rate ?? 0),
                quantity: itemType === "product" ? Number(catalogItem.quantity ?? 0) : Number.POSITIVE_INFINITY,
                pivot: { quantity: 1, product_id: catalogItem.id, user_id: 1 }
            };
            this.setState({ cart: [...this.state.cart, newItem] });
        }

        axios.post("/admin/cart", { barcode })
            .catch(err => Swal.fire("Error!", err.response?.data?.message || "Failed", "error"));
    }

    setCustomerId(e) { this.setState({ customer_id: e.target.value }); }

    handleClickSubmit() {
        const { translations, cart, customer_id } = this.state;
        const saleTotals = this.getSaleTotals(cart);
        const total = saleTotals.total.toFixed(2);
        const itemRates = cart.reduce((rates, item) => {
            rates[this.getCartItemKey(item)] = Number(item.price ?? item.rate ?? 0);
            return rates;
        }, {});
        const orderPayload = {
            customer_id,
            item_rates: itemRates,
            subtotal: saleTotals.subtotal,
            tax_percent: saleTotals.taxPercent,
            tax_amount: saleTotals.taxAmount,
            discount_percent: saleTotals.discountPercent,
            discount_amount: saleTotals.discountAmount,
        };
        Swal.fire({
            title: translations["received_amount"] || "Received Amount",
            input: "number", inputValue: total,
            inputAttributes: { min: total, step: "0.01" },
            inputLabel: `Total: ${window.APP.currency_symbol}${total}`,
            cancelButtonText: translations["cancel_pay"] || "Cancel",
            showCancelButton: true,
            confirmButtonText: translations["confirm_pay"] || "Confirm",
            confirmButtonColor: "#2a69b0",
            showLoaderOnConfirm: true,
            preConfirm: amount =>
                axios.post("/admin/orders", { ...orderPayload, amount })
                    .then(res => { this.resetSaleAdjustments(); return res.data; })
                    .catch(err => Swal.showValidationMessage(err.response?.data?.message || "Error")),
            allowOutsideClick: () => !Swal.isLoading(),
        }).then(result => {
            if (result.value?.order) this.showReceipt(result.value.order);
        });
    }

buildSrbBarcodeSvg(reference = "SRB-000000") {
    const displayRef = String(reference).toUpperCase(); // dash ke sath dikhane ke liye
    const cleanRef = displayRef.replace(/[^A-Z0-9]/g, "") || "SRB000000";
    const bars = [
        "101001101101", "110100101011", "110101001011", "110101011001", "101101001011",
        "110011010011", "110110100101", "110110101001", "110010101011", "110010110101"
    ];

    let pattern = "";
    for (let i = 0; i < cleanRef.length; i += 1) {
        const index = (cleanRef.charCodeAt(i) % 10 + i) % 10;
        pattern += bars[index % bars.length];
    }

    const barSegments = [];
    for (let i = 0; i < pattern.length; i += 1) {
        if (pattern[i] === "1") {
            const width = 2;
            const x = barSegments.length * 2.2;
            barSegments.push(`<rect x="${x}" y="8" width="${width}" height="44" fill="#111827" />`);
        }
    }

    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="240" height="72" viewBox="0 0 240 72" role="img" aria-label="Barcode">
            <g fill="#111827">
                ${barSegments.join("")}
            </g>
            <text x="120" y="67" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#111827">${displayRef}</text>
        </svg>
    `;
}

    buildSrbLogoSvg() {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="54" viewBox="0 0 220 54" role="img" aria-label="SRB logo">
                <defs>
                    <linearGradient id="srbGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stop-color="#0f172a" />
                        <stop offset="100%" stop-color="#1d4ed8" />
                    </linearGradient>
                </defs>
                <rect x="0" y="0" width="220" height="54" rx="12" fill="#f8fafc" stroke="#dbeafe" />
                <rect x="12" y="11" width="32" height="32" rx="8" fill="url(#srbGradient)" />
                <text x="28" y="33" text-anchor="middle" font-size="18" font-weight="700" fill="#ffffff" font-family="Arial, sans-serif">S</text>
                <text x="55" y="35" font-size="24" font-weight="800" fill="#0f172a" font-family="Arial, sans-serif">RB</text>
                <text x="120" y="36" font-size="11" letter-spacing="1.5" fill="#475569" font-family="Arial, sans-serif">SECURE PAYMENT</text>
            </svg>
        `;
    }

    showReceipt(order) {
        const currency = window.APP.currency_symbol || "";
        const customerName = order.customer
            ? `${order.customer.first_name} ${order.customer.last_name}`
            : "Walk-in Customer";
        const createdAt = new Date(order.created_at).toLocaleString();
        const branchName = order.branch?.name || "Main Branch";
        const counterName = order.counter?.name || "Counter 1";
        const invoiceNo = order.invoice_no || `POS-${String(order.id).padStart(4, "0")}`;
        const invoiceTitleNo = `Order ID-${String(order.id).padStart(4, "0")}`;

        const headerHTML = CommonHelper.getReceiptHeaderHTML({
            branchName: branchName,
            branchAddress: order.branch?.address,
            branchPhone: order.branch?.phone, // agar field exist karti hai to hi dikhega
        });
        const footerHTML = CommonHelper.getReceiptFooterHTML(createdAt);

        const items = (order.items || []).map(item => {
            const quantity = Number(item.quantity || 0);
            const lineTotal = Number(item.price || 0);
            const unitPrice = quantity ? lineTotal / quantity : lineTotal;
            const name = item.item_name || (Number(item.item_type) === 1 ? "Service" : item.product?.name || "Product");

            return `<div class="receipt-item-block">
                <div class="receipt-item-name">${name}</div>
                <div class="receipt-item-row"><span class="col-item"></span><span class="col-qty">${quantity}</span><span class="col-price">${unitPrice.toFixed(2)}</span><span class="col-total">${lineTotal.toFixed(2)}</span></div>
            </div>`;
        }).join("");

        const subtotal = Number(order.subtotal ?? (order.items || []).reduce((s, i) => s + Number(i.price), 0));
        const taxPercent = Number(order.tax_percent || 0);
        const taxAmount = Number(order.tax_amount || 0);
        const discountPercent = Number(order.discount_percent || 0);
        const discountAmount = Number(order.discount_amount || 0);
        const total = Number(order.total_amount ?? (subtotal + taxAmount - discountAmount));
        const received = (order.payments || []).reduce((s, p) => s + Number(p.amount), 0);
        const changeDue = received > total ? received - total : 0;
        const valueForSales = subtotal - discountAmount;

        // Payment status: purely descriptive of the POS flow (cash collected at order time),
        // not a fabricated field — omits itself if no payment recorded.
        const paymentStatus = received > 0 ? "PAID (CASH)" : null;
        // Sales By: only shown if your order actually carries this — no fake name inserted.
        const salesByName = order.user?.name || order.cashier?.name || null;

        const barcodeSvg = this.buildSrbBarcodeSvg(invoiceNo);

        const metaRows = [
            { label: "Receipt No.", value: invoiceNo },
            // { label: "Order ID", value: `#${order.id}` },
            paymentStatus ? { label: "Payment Status", value: paymentStatus } : null,
            { label: "Date", value: createdAt },
            salesByName ? { label: "Sales By", value: salesByName } : null,
            { label: "Terminal", value: counterName },
            { label: "Customer", value: customerName },
        ].filter(Boolean);

        const metaHTML = metaRows.map(row =>
            `<div class="meta-row"><span class="meta-label">${row.label}</span><span class="meta-value">${row.value}</span></div>`
        ).join("");

        const srbInvoiceId = order.srb_invoice_id;
        const srbQrCodeLink = order.srb_qr_code_link;
        const srbQrImage = srbQrCodeLink
            ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(srbQrCodeLink)}`
            : "";
        const srbFooter = srbInvoiceId ? `
            <div class="srb-footer">
                <div class="srb-row">
                    <div class="srb-logo-cell">${window.APP.srb_pos_logo_url ? `<img class="srb-pos-logo" src="${window.APP.srb_pos_logo_url}" alt="SRB POS">` : ""}</div>
                    <div class="srb-code-cell">
                        <div class="srb-label">SRB Invoice No.</div>
                        <div class="srb-invoice-id">${srbInvoiceId}</div>
                        <div class="logos-srb">
                            <img src="${imageUrl}" alt="SRB Logo">
                        </div>
                    </div>
                </div>
                <div class="srb-verify">Scan to verify this invoice</div>
            </div>` : "";

        const receiptHTML = `
            <div id="thermal-receipt" class="thermal-receipt">
                ${headerHTML}
                <div class="receipt-divider"></div>
                <!---<div class="invoice-title">Sales Tax Invoice</div>!-->
                <div class="invoice-number">*${invoiceTitleNo}*</div>
            
                <div class="receipt-divider-double"></div>

                <div class="meta-grid">${metaHTML}</div>

                <div class="receipt-divider-double"></div>
                <div class="receipt-table-head"><span class="col-item">ITEM DESCRIPTION</span><span class="col-qty">QTY</span><span class="col-price">PRICE</span><span class="col-total">AMOUNT</span></div>
                <div class="receipt-divider"></div>
                ${items}
                <div class="receipt-divider"></div>

                <div class="receipt-summary">
                    <div class="summary-row"><span>SUBTOTAL:</span><span>${currency} ${subtotal.toFixed(2)}</span></div>
                    ${taxAmount > 0 ? `<div class="summary-row"><span>Total Sales Tax (${taxPercent.toFixed(2)}%)</span><span>${currency} ${taxAmount.toFixed(2)}</span></div>` : ""}
                    ${discountAmount > 0 ? `<div class="summary-row"><span>Discount (${discountPercent.toFixed(2)}%)</span><span>-${currency} ${discountAmount.toFixed(2)}</span></div>` : ""}
                    ${discountAmount > 0 ? `<div class="summary-row"><span>Value for Sales</span><span>${currency} ${valueForSales.toFixed(2)}</span></div>` : ""}
                    <div class="receipt-divider"></div>
                    <div class="summary-row"><span>Total Value Including Sales Tax</span><span>${currency} ${subtotal.toFixed(2)}</span></div>
                    <div class="receipt-divider"></div>
                    <div class="summary-row grand-total"><span>NET TOTAL</span><span>${currency} ${total.toFixed(2)}</span></div>
                    <div class="receipt-divider"></div>
                    <div class="summary-row"><span>Cash</span><span>${currency} ${received.toFixed(2)}</span></div>
                    <div class="summary-row"><span>Change Due</span><span>${currency} ${changeDue.toFixed(2)}</span></div>
                </div>

                <div class="receipt-divider"></div>

                <div class="terms-block">
                    <div class="terms-title">Terms &amp; Conditions of Sale</div>
                    No Refund.<br>
                    Exchanges on unused products within 10 days only from the outlet where purchased.<br>
                    Claim will not be accepted without Sales Tax Invoice.
                </div>
                ${srbFooter}
                 <div class="receipt-divider"></div>
                ${footerHTML}
            </div>`;

        Swal.fire({
            // title: "Thermal Print Receipt",
            html: `<style>
                .receipt-modal .swal2-html-container{margin:0;padding:0 10px}
                ${CommonHelper.getThermalPrintStyles()}
            </style>
            ${receiptHTML}`,
            width: 440, showCancelButton: true,
            confirmButtonText: "Print",
            confirmButtonColor: "#2a69b0",
            cancelButtonText: "Close",
            customClass: { popup: "receipt-modal" },
        }).then(result => { if (result.isConfirmed) this.printReceipt(order); });
    }

    printReceipt(order) {
        const receipt = document.getElementById("thermal-receipt");
        if (!receipt) return;
        const win = window.open("", "_blank", "width=450,height=700");
        win.document.write(`<!doctype html><html><head><title>Receipt #${order.id}</title>
        <style>${CommonHelper.getThermalPrintStyles()}</style></head><body>${receipt.outerHTML}</body></html>`);
        win.document.close(); win.focus(); win.print(); win.close();
    }

    // ''‚''‚¬ Render helpers ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬

    renderCartItem(c) {
        const { hoveredRemove } = this.state;
        const currency = window.APP.currency_symbol || "";
        const itemKey = this.getCartItemKey(c);
        const unitPrice = Number(c.price ?? c.rate ?? 0);
        const lineTotal = (unitPrice * c.pivot.quantity).toFixed(2);
        return (
            <div key={itemKey} style={S.cartRow}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={S.cartItemName} title={c.name}>{c.name}</div>
                    <div style={S.cartItemPrice}>{currency}{unitPrice.toFixed(2)} each</div>
                </div>
                <div style={S.qtyControl}>
                    <button style={S.qtyBtn}
                        onClick={() => this.handleChangeQty(itemKey, Math.max(1, Number(c.pivot.quantity) - 1))}>-</button>
                    <input type="number" style={S.qtyInput} value={c.pivot.quantity} min={1}
                        onChange={e => this.handleChangeQty(itemKey, e.target.value)} />
                    <button style={S.qtyBtn}
                        onClick={() => this.handleChangeQty(itemKey, Number(c.pivot.quantity) + 1)}>+</button>
                </div>
                <div style={S.cartItemTotal}>{currency}{lineTotal}</div>
                <button
                    style={{ ...S.removeBtn, color: hoveredRemove === itemKey ? "#ef4444" : "#d1d5db", background: hoveredRemove === itemKey ? "#fef2f2" : "none" }}
                    onMouseEnter={() => this.setState({ hoveredRemove: itemKey })}
                    onMouseLeave={() => this.setState({ hoveredRemove: null })}
                    onClick={() => this.handleClickDelete(itemKey)}>
                    <SndIcon name="x" />
                </button>
            </div>
        );
    }

    renderProductTile(p) {
        const { hoveredTile } = this.state;
        const currency = window.APP.currency_symbol || "";
        const isHovered = hoveredTile === p.id;
        const isService = p.item_type === "service";
        const stockValue = Number.isFinite(Number(p.quantity)) ? Number(p.quantity) : null;
        const isLow = !isService && stockValue !== null && window.APP.warning_quantity > stockValue;
        const displayPrice = Number(p.price ?? p.rate ?? 0);

        return (
            <div key={`${p.item_type || "product"}:${p.id}`}
                style={{ ...S.productTile, borderColor: isHovered ? "#0ea5b0" : "#e8ecf2", boxShadow: isHovered ? "0 6px 18px rgba(14,165,176,0.18)" : "none", transform: isHovered ? "translateY(-2px)" : "none" }}
                onMouseEnter={() => this.setState({ hoveredTile: p.id })}
                onMouseLeave={() => this.setState({ hoveredTile: null })}
                onClick={() => this.addProductToCart(p.barcode)}
                title={p.name}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: isHovered ? "#0ea5b0" : "transparent" }} />
                <div style={S.productTileImgWrap}>
                    {p.image_url
                        ? <img src={p.image_url} alt={p.name} style={S.productTileImg}
                            onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                        : null}
                    <span style={{ display: p.image_url ? "none" : "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "1.6rem", color: "#cbd5e1" }}>
                        <SndIcon name={isService ? "tags" : "package-open"} />
                    </span>
                </div>
                <div style={S.productTileName}>{p.name}</div>
                <span style={S.productTileStock(isLow || isService ? false : isLow)}>{isService ? "Service" : (isLow ? "" : "") + `${stockValue ?? 0} left`}</span>
                <div style={S.productTilePrice}>{currency}{displayPrice.toFixed(2)}</div>
            </div>
        );
    }

    // ''‚''‚¬ Gate screen ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬

    renderGateScreen() {
        const { branchVerified, activeBranch } = this.state;
        const step = branchVerified ? 2 : 1;

        return (
            <div className="snd-pos-gate">
                <div className="snd-pos-gate-card">
                    {/* Step indicators */}
                    <div className="snd-pos-steps">
                        <div className={`snd-pos-step ${step === 1 ? "is-active" : "is-done"}`}>
                            {step > 1 ? <SndIcon name="check" /> : "1"}
                        </div>
                        <div className="snd-pos-step-line"></div>
                        <div className={`snd-pos-step ${step === 2 ? "is-active" : ""}`}>2</div>
                    </div>

                    <div className="snd-pos-gate-icon">
                        <SndIcon name={step === 1 ? "git-branch" : "monitor"} />
                    </div>

                    <div className="snd-pos-gate-title">
                        {step === 1 ? "Branch Access Required" : "Counter Access Required"}
                    </div>
                    <div className="snd-pos-gate-subtitle">
                        {step === 1
                            ? "Select your branch and enter the branch password to continue."
                            : "Select your counter and enter the counter password to open the POS."}
                    </div>

                    {step === 2 && activeBranch && (
                        <div className="snd-pos-branch-badge">
                            <SndIcon name="circle-check" />
                            {activeBranch.name} ({activeBranch.code})
                        </div>
                    )}

                    <button
                        className="snd-pos-gate-button"
                        onClick={step === 1 ? this.showBranchModal : this.showCounterModal}>
                        <SndIcon name={step === 1 ? "key" : "lock-open"} className="mr-2" />
                        {step === 1 ? "Enter Branch Password" : "Enter Counter Password"}
                    </button>
                </div>
            </div>
        );
    }

    // ''‚''‚¬ Main render ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬

    render() {
        const { cart, products, services, customers, customer_id, barcode, translations,
            gateChecked, branchVerified, counterVerified,
            activeBranch, activeCounter, search } = this.state;

        const currency = window.APP.currency_symbol || "";
        const saleTotals = this.getSaleTotals(cart);
        const taxEnabled = !!window.APP?.tax_enabled;
        const discountEnabled = !!window.APP?.discount_enabled;
        const editableItemRate = !!window.APP?.editable_item_rate;
        const itemCount = cart.reduce((s, c) => s + Number(c.pivot.quantity), 0);
        const catalogItems = [...products, ...services];
        const showProducts = !!(window.APP?.show_products !== false);
        const showServices = !!window.APP?.show_services;
        const filterOptions = [
            { key: "all", label: "All Items" },
            ...(showProducts ? [{ key: "product", label: "Products" }] : []),
            ...(showServices ? [{ key: "service", label: "Services" }] : []),
        ];
        const activeFilter = this.state.activeFilter || "all";
        const filteredCatalog = catalogItems.filter(item => {
            if (activeFilter === "all") return true;
            return (item.item_type || "product") === activeFilter;
        });

        // Not yet checked session status
        if (!gateChecked) {
            return (
                <div className="snd-pos-loading">
                    <SndIcon name="loader-circle" className="fa-spin" aria-label="Loading POS" />
                </div>
            );
        }

        // Gate not passed ''‚'' show lock screen
        if (!branchVerified || !counterVerified) {
            return this.renderGateScreen();
        }

        // ''‚''‚¬ POS screen ''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚''‚¬
        const dashboardCards = filteredCatalog;

        return (
            <div className="pos-shell">
                <div className="pos-panel">
                    <div className="pos-layout">
                        <div className="pos-catalog">
                            <div className="pos-catalog-toolbar">
                                <div className="pos-catalog-title">Menu Categories</div>
                                <label className="pos-search-control">
                                    <input type="text" value={search || ""} placeholder="Search..." onChange={this.handleChangeSearch} onKeyDown={this.handleSeach} />
                                    <SndIcon name="search" />
                                </label>
                            </div>

                            <div className="pos-filter-row">
                                {filterOptions.map((cat) => (
                                    <button key={cat.key} type="button" onClick={() => this.setState({ activeFilter: cat.key })} className={`pos-filter-chip ${activeFilter === cat.key ? "is-active" : ""}`}>
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            <div className="pos-product-grid">
                                {dashboardCards.length === 0 ? (
                                    <div className="pos-empty-state">No items found</div>
                                ) : (
                                    dashboardCards.map((item, idx) => {
                                        const displayPrice = Number(item.price ?? item.rate ?? 0);
                                        const productLabel = item.item_type === 'service' ? 'Service' : 'Menu';
                                        return (
                                            <div key={`${item.item_type || 'product'}:${item.id}`} onClick={() => this.addProductToCart(item.barcode)} className="pos-product-card">
                                                <div className="pos-product-accent"></div>
                                                <div className="pos-product-image">
                                                    {item.image_url ? (
                                                        <>
                                                            <img src={item.image_url} alt={item.name} onError={(e) => {
                                                                e.currentTarget.style.display = "none";
                                                                const fallback = e.currentTarget.parentElement?.querySelector(".pos-product-image-fallback");
                                                                if (fallback) fallback.classList.remove("is-hidden");
                                                            }} />
                                                            <div className="pos-product-image-icon pos-product-image-fallback is-hidden">
                                                                <SndIcon name={item.item_type === 'service' ? 'tags' : 'sparkles'} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="pos-product-image-icon">
                                                            <SndIcon name={item.item_type === 'service' ? 'tags' : 'sparkles'} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="pos-product-card-body">
                                                    <div className="pos-product-meta">
                                                        <span className="pos-product-label">{productLabel}</span>
                                                        <span className="pos-product-index">#{idx + 1}</span>
                                                    </div>
                                                    <div className="pos-product-name" title={item.name}>{item.name}</div>
                                                    <div className="pos-product-bottom">
                                                        <span className="pos-product-price">{currency}{displayPrice.toFixed(2)}</span>
                                                        <div className="pos-product-qty">
                                                            <button
                                                                type="button"
                                                                aria-label={`Decrease ${item.name}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const itemKey = `${item.item_type || 'product'}:${item.id}`;
                                                                    const currentQty = Number((cart.find(c => this.getCartItemKey(c) === itemKey)?.pivot?.quantity) || 0);
                                                                    this.handleChangeQty(itemKey, Math.max(1, currentQty - 1));
                                                                }}
                                                            >-</button>
                                                            <button
                                                                type="button"
                                                                aria-label={`Increase ${item.name}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.addProductToCart(item.barcode);
                                                                }}
                                                            >+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <aside className="pos-order-panel">
                            <div className="pos-order-header">
                                <div className="pos-order-title">Order #{cart.length > 0 ? cart[0]?.id || "-" : "-"}</div>
                                <div className="pos-order-toolbar">
                                    <button type="button" aria-label="Change POS session" onClick={() => this.handleClearSession()}><SndIcon name="arrow-right-left" /></button>
                                </div>
                            </div>

                            {/* Customer Select & Quick Add Bar */}
                            <div className="pos-customer-wrapper">
                                <div className="pos-customer-label-row">
                                    <span className="pos-customer-label">
                                        <SndIcon name="circle-user" />
                                        Customer
                                    </span>
                                    <button type="button" onClick={this.showAddCustomerModal} className="pos-customer-add">
                                        <SndIcon name="user-plus" /> + Add New
                                    </button>
                                </div>

                                <select
                                    id="pos-customer-select"
                                    className="form-control"
                                    value={customer_id || ""}
                                    onChange={(e) => this.setState({ customer_id: e.target.value })}>
                                    <option value="">Walk-in Customer (Default)</option>
                                    {customers.map(cust => {
                                        const fullName = [cust.first_name, cust.last_name].filter(Boolean).join(" ");
                                        return (
                                            <option key={cust.id} value={cust.id}>
                                                {fullName} {cust.phone ? `(${cust.phone})` : ""}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="pos-section-header">
                                <div className="pos-section-title">Ordered Services</div>
                                <div className="pos-section-meta">Total Items: {itemCount}</div>
                            </div>

                            <div className="pos-order-items">
                                {cart.length === 0 ? (
                                    <div className="pos-empty-cart">Cart is empty</div>
                                ) : (
                                    cart.map(item => {
                                        const unitPrice = Number(item.price ?? item.rate ?? 0);
                                        const qty = Number(item.pivot?.quantity || 0);
                                        return (
                                            <div className="pos-order-item" key={this.getCartItemKey(item)}>
                                                <div className="pos-order-item-header">
                                                    <div className="pos-order-item-copy">
                                                        <div className="pos-order-item-name">{item.name}</div>
                                                        <div className="pos-order-item-type">{item.item_type === 'service' ? 'Service' : 'Item'}</div>
                                                    </div>
                                                    <button type="button" aria-label={`Remove ${item.name}`} onClick={() => this.handleClickDelete(this.getCartItemKey(item))} className="pos-order-remove"><SndIcon name="x" /></button>
                                                </div>

                                                <div className="pos-order-item-controls">
                                                    <div className="pos-qty-control">
                                                        <button type="button" className="pos-qty-button" onClick={() => this.handleChangeQty(this.getCartItemKey(item), Math.max(1, qty - 1))}>-</button>
                                                        <span className="pos-qty-value">{qty}</span>
                                                        <button type="button" className="pos-qty-button" onClick={() => this.handleChangeQty(this.getCartItemKey(item), qty + 1)}>+</button>
                                                    </div>
                                                    {editableItemRate ? (
                                                        <input type="number" className="form-control pos-item-rate" min="0" step="0.01" value={unitPrice} onClick={e => e.stopPropagation()} onChange={e => {
                                                            const nextPrice = e.target.value;
                                                            this.setState({ cart: cart.map(cartItem => this.getCartItemKey(cartItem) === this.getCartItemKey(item) ? { ...cartItem, price: nextPrice } : cartItem) });
                                                        }} />
                                                    ) : <span className="pos-order-item-total">{currency}{(unitPrice * qty).toFixed(2)}</span>}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="pos-order-summary">
                                <div className="pos-summary-row"><span>Sub Total</span><span>{currency}{saleTotals.subtotal.toFixed(2)}</span></div>
                                {taxEnabled && <div className="pos-adjustments">
                                    <div className="pos-summary-row"><span>Tax</span><span>{currency}{saleTotals.taxAmount.toFixed(2)}</span></div>
                                    <div className="pos-adjustment-fields">
                                        <input className="form-control" type="number" min="0" step="0.01" placeholder="Tax %" value={saleTotals.taxPercent || ""} onChange={this.setTaxPercent} />
                                        <input className="form-control" type="number" min="0" step="0.01" placeholder="Tax amount" value={saleTotals.taxAmount ? saleTotals.taxAmount.toFixed(2) : ""} onChange={this.setTaxAmount} />
                                    </div>
                                </div>}
                                {discountEnabled && <div className="pos-adjustments">
                                    <div className="pos-summary-row"><span>Discount</span><span>-{currency}{saleTotals.discountAmount.toFixed(2)}</span></div>
                                    <div className="pos-adjustment-fields">
                                        <input className="form-control" type="number" min="0" step="0.01" placeholder="Discount %" value={saleTotals.discountPercent || ""} onChange={this.setDiscountPercent} />
                                        <input className="form-control" type="number" min="0" step="0.01" placeholder="Discount amount" value={saleTotals.discountAmount ? saleTotals.discountAmount.toFixed(2) : ""} onChange={this.setDiscountAmount} />
                                    </div>
                                </div>}
                                <div className="pos-total-row"><span>Amount to Pay</span><span className="pos-total-amount">{currency}{saleTotals.total.toFixed(2)}</span></div>
                            </div>

                            <div className="pos-order-actions">
                                <button type="button" onClick={this.handleClickSubmit}>Place an Order</button>
                                <div className="pos-action-grid">
                                    <button type="button" className="pos-secondary-action">Print</button>
                                    <button type="button" className="pos-secondary-action">Invoice</button>
                                    <button type="button" className="pos-secondary-action">Draft</button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cart;

const cartRoot = document.getElementById("cart");
if (cartRoot) createRoot(cartRoot).render(<Cart />);

