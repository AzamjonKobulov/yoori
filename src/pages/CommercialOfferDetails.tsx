import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  ToastSuccess,
  DeleteConfirmation,
  AddCrmFields,
  EditAmount,
  type AmountField,
} from "../components";
import TemplateActionsDropdown from "../components/ui/TemplateActionsDropdown";
import VersionHistory from "../components/modals/VersionHistory";
import VersionReverter from "../components/modals/VersionReverter";
import ProductGroup from "../components/ProductGroup";
import { AnimatePresence, motion } from "framer-motion";
import { apiCP } from "../http/apis";

// ============================================================================
// DUAL-PURPOSE PAGE: COMMERCIAL OFFER DETAILS / TEMPLATE EDITOR
// ============================================================================
//
// This page serves dual purposes and switches behavior based on navigation state:
//
// 1. TEMPLATE MODE (pageMode === 'TEMPLATE'):
//    - Used for creating/editing templates from the Templates page
//    - Shows template-specific buttons (Save Template, Copy Template, Delete Template)
//    - Uses TemplateActionsDropdown for template actions
//    - Handles template statuses: "Создан", "Черновик"
//    - Navigation: navigate("/details", { state: { isNewTemplate: true, ... } })
//
// 2. COMMERCIAL_OFFER MODE (pageMode === 'COMMERCIAL_OFFER'):
//    - Used for viewing commercial offers from the CommercialOffers page
//    - Shows commercial offer-specific buttons (Save Changes, Share CP, Version History)
//    - Uses three dots button that opens VersionHistory modal
//    - Handles commercial offer statuses: "Создано", "Согласование", "Отправлено", "Отказ", "Продано"
//    - Navigation: navigate("/details", { state: { isCommercialOffer: true, ... } })
//
// ============================================================================
// API INTEGRATION NOTES FOR FUTURE DEVELOPERS:
// ============================================================================
//
// When integrating with APIs, consider:
// 1. Different API endpoints for templates vs commercial offers
// 2. Different data structures and validation rules
// 3. Different permission levels and user roles
// 4. Different save/update logic for each mode
// 5. Consider splitting into separate components if complexity grows
//
// Current navigation patterns:
// - Templates page → navigate("/details", { state: { isNewTemplate: true, templateName: "...", ... } })
// - CommercialOffers page → navigate("/details", { state: { isCommercialOffer: true, templateName: "...", ... } })
// ============================================================================

type PageMode = "TEMPLATE" | "COMMERCIAL_OFFER";

interface NavigationState {
  id?: string;
  templateName?: string;
  templateStatus?: string;
  templateVariants?: unknown[];
  isNewTemplate?: boolean;
  isTemplateCopy?: boolean;
  isCommercialOffer?: boolean;
}

export default function CommercialOfferDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  // const [options, setOptions] = useState<Option[]>([]);

  let navigationState: NavigationState = location.state || {};

  useEffect(() => {
    async function start() {
      const userInfo = await apiCP.get("/user/v1/current/info");
      apiCP.defaults.baseURL = `https://${userInfo.data.domain}`;

            const res = await apiCP.get(`/offer/v1/${navigationState.id}`);
            setIntroduction(res.data.description);
            getOptions();
            getCrmFields();
        }

        start();
    }, [navigationState]);

    // ============================================================================
    // PAGE TYPE DETECTION & DATA EXTRACTION
    // ============================================================================

    // Get URL search parameters as fallback
    const searchParams = new URLSearchParams(location.search);
    const urlType = searchParams.get("type");

    async function editOffer() {
        try {
            if (templateName) {
                await apiCP.patch(`/offer/v1/${navigationState.id}/`, {
                    // template_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    // manager_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    // client_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    name: editableTemplateName,
                    description: introduction,
                    is_draft: editableStatus == "Черновик",
                });
            } else {
                await apiCP.patch(`/offer/v1/${navigationState.id}/`, {
                    // template_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    // manager_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    // client_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    name: editableTemplateName,
                    status: editableStatus,
                    description: introduction,
                    is_template: false,
                    is_draft: false,
                });
            }
        } catch (err) {
            console.log(err);
        }
      const res = await apiCP.get(`/offer/v1/${navigationState.id}`);
      setIntroduction(res.data.description);
      getOptions();
      getCrmFields();
    }

    start();
  }, [navigationState]);

  // ============================================================================
  // PAGE TYPE DETECTION & DATA EXTRACTION
  // ============================================================================

  // Get URL search parameters as fallback
  const searchParams = new URLSearchParams(location.search);
  const urlType = searchParams.get("type");

  async function editOffer() {
    try {
      await apiCP.patch(`/offer/v1/${navigationState.id}/`, {
        // template_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        // manager_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        // client_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        name: editableTemplateName,
        status: editableStatus,
        description: introduction,
        is_template: false,
        is_draft: false,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function getOptions() {
    try {
      const res1 = await apiCP.get(`/option/v1/${navigationState.id}/list`);
      setVariants(
        res1.data.map((variant: any) => {
          return {
            id: variant.id,
            name: variant.name,
            isRecommended: variant.is_recommended,
            isHidden: variant.is_hidden,
            productGroups: [],
            tableRows: [],
          };
        })
      );
      getGroups();
    } catch (err) {
      console.log(err);
    }
  }

  async function addOption(option: any) {
    try {
      await apiCP.post(`/option/v1/${navigationState.id}/create/`, {
        ...option,
      });
    } catch (err) {
      console.log(err);
    }
  }
  async function editOption(field: string) {
    try {
      const res = await apiCP.get(`/option/v1/${navigationState.id}/list`);
      const option = res.data.filter(
        (item: any) => item.id == activeVariantId
      )[0];

      let isRecommended = option.is_recommended;
      let isHidden = option.is_hidden;

      if (field) {
        if (field == "isRecommended") {
          if (!isRecommended) isHidden = false;
          isRecommended = !isRecommended;
        } else {
          if (!isHidden) isRecommended = false;
          isHidden = !isHidden;
        }
      }

      await apiCP.patch(`/option/v1/${activeVariantId}/`, {
        name: editingVariantValue,
        is_recommended: isRecommended,
        is_hidden: isHidden,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteOption(id: any) {
    try {
      await apiCP.delete(`/option/v1/${id}/`);
    } catch (err) {
      console.log(err);
    }
  }

  async function getGroups() {
    try {
      const res = await apiCP.get(`/group/v1/${activeVariantId}/list`);

      setVariants((prev) =>
        prev.map((variant) =>
          variant.id === activeVariantId
            ? {
                ...variant,
                productGroups: res.data.items.map((item: any) => {
                  return {
                    id: item.id,
                    name: item.name,
                    amount: 0,
                    cost: 0,
                    costAmount: 0,
                    products: [],
                  };
                }),
              }
            : variant
        )
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function createGroup(name: any) {
    try {
      await apiCP.post(`/group/v1/${activeVariantId}/create/`, {
        name,
        is_default: false,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function editGroup(groupId: any, name: any) {
    try {
      await apiCP.patch(`/group/v1/group/${groupId}/`, {
        name,
        is_default: false,
      });
    } catch (err) {
      console.log(err);
    }
  }

    const [products, setProducts] = useState<Map<string, any[]>>(new Map());

    useEffect(() => {
        console.log(products);
    }, [products]);

    async function getProducts(groupId: any) {
        try {
            const res = await apiCP.get(`/group/v1/product/${groupId}/list`);
            const resProducts = await res.data.map((item: any) => {
                return {
                    id: item.id,
                    name: item.product_name,
                    amount: String(item.amount),
                    cost: String(item.product_price),
                    costAmount: String(item.total_price),
                };
            });

            setProducts(new Map(products.set(groupId, resProducts)));
            console.log("getProducts");
        } catch (err) {
            console.log(err);
        }
  async function deleteGroup(groupId: any) {
    try {
      await apiCP.delete(`/group/v1/${groupId}/`);
    } catch (err) {
      console.log(err);
    }
  }

  const [products, setProducts] = useState<Map<string, any[]>>(new Map());

  useEffect(() => {
    console.log(products);
  }, [products]);

  async function getProducts(groupId: any) {
    try {
      const res = await apiCP.get(`/group/v1/product/${groupId}/list`);
      const resProducts = await res.data.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          amount: String(item.amount),
          cost: String(item.price),
          costAmount: String(item.total_price),
        };
      });

      setProducts(new Map(products.set(groupId, resProducts)));
      console.log("getProducts");
    } catch (err) {
      console.log(err);
    }
  }

  async function createQuickProduct(groupId: any) {
    try {
      await apiCP.post(`/group/v1/product/${groupId}/create/`, {
        name: "Название товара",
        price: 1,
        amount: 1,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function createProduct(groupId: any, products: any[]) {
    try {
      await apiCP.post(`/group/v1/product/${groupId}/fast_create/`, {
        product_ids: products,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function editProduct(groupId: any, productId: any, newProduct: any) {
    try {
      await apiCP.patch(`/group/v1/product/${productId}/`, {
        ...products
          .get(groupId)
          ?.filter((product: any) => product.id === productId)[0],
        ...newProduct,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteProduct(productId: any) {
    try {
      await apiCP.delete(`/group/v1/product/${productId}/`);
    } catch (err) {
      console.log(err);
    }
  }

  async function getCrmFields() {
    try {
      const res = await apiCP.get(`/offer/field/v1/${navigationState.id}/list`);
      setCrmFields(
        res.data.items.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            value: item.value,
          };
        })
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function addCrmFields(name: any) {
    try {
      await apiCP.post(`/offer/field/v1/${navigationState.id}/create/`, {
        name,
        value: "",
      });
    } catch (err) {
      console.log(err);
    }
  }

  // Determine page mode based on navigation state or URL parameters
  const pageMode: PageMode =
    navigationState.isCommercialOffer || urlType === "commercial-offer"
      ? "COMMERCIAL_OFFER"
      : "TEMPLATE";

  // Extract data based on page mode
  const pageData = {
    name: navigationState.templateName || "Коммерческие предложения",
    status: navigationState.templateStatus || "Создано",
    variants: navigationState.templateVariants || [],
    isNew: navigationState.isNewTemplate || false,
    isCopy: navigationState.isTemplateCopy || false,
  };

  // Legacy variables for backward compatibility (can be removed after refactoring)
  const templateName = pageData.name;
  const templateStatus = pageData.status;
  const templateVariants = pageData.variants;
  const isNewTemplate = pageData.isNew;
  const isTemplateCopy = pageData.isCopy;

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  // Get status color based on status (handles both template and commercial offer statuses)
  const getStatusColor = (status: string): string => {
    switch (status) {
      // Commercial Offer statuses
      case "Создано":
        return "bg-neutral-500";
      case "Согласование":
        return "bg-amber-500";
      case "Отправлено":
        return "bg-blue-500";
      case "Отказ":
        return "bg-rose-500";
      case "Продано":
        return "bg-teal-500";
      // Template statuses
      case "Создан":
        return "bg-teal-500";
      case "Черновик":
        return "bg-neutral-500";
      default:
        return "bg-neutral-500";
    }
  };

  const getStatusTextColor = (status: string): string => {
    switch (status) {
      // Commercial Offer statuses
      case "Создано":
        return "text-neutral-500";
      case "Согласование":
        return "text-amber-500";
      case "Отправлено":
        return "text-blue-500";
      case "Отказ":
        return "text-rose-500";
      case "Продано":
        return "text-teal-500";
      // Template statuses
      case "Создан":
        return "text-teal-500";
      case "Черновик":
        return "text-neutral-500";
      default:
        return "text-neutral-500";
    }
  };

  // ============================================================================
  // BUTTON RENDERING FUNCTIONS
  // ============================================================================

  // Render buttons for TEMPLATE mode
  const renderTemplateButtons = () => {
    if (pageData.isNew) {
      // New template: Show only "Сохранить шаблон" button
      return (
        <Button variant="primary" onClick={handleSaveChanges}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3333 14V9.33333C11.3333 9.15652 11.2631 8.98695 11.1381 8.86193C11.013 8.7369 10.8435 8.66667 10.6667 8.66667H5.33333C5.15652 8.66667 4.98695 8.7369 4.86193 8.86193C4.7369 8.98695 4.66667 9.15652 4.66667 9.33333V14M4.66667 2V4.66667C4.66667 4.84348 4.7369 5.01305 4.86193 5.13807C4.98695 5.2631 5.15652 5.33333 5.33333 5.33333H10M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z"
              stroke="#FAFAFA"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Сохранить шаблон
        </Button>
      );
    } else if (pageData.isCopy) {
      // Template copy: Show only "Сохранить копию шаблона" button
      return (
        <Button variant="primary" onClick={handleSaveChanges}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3333 14V9.33333C11.3333 9.15652 11.2631 8.98695 11.1381 8.86193C11.013 8.7369 10.8435 8.66667 10.6667 8.66667H5.33333C5.15652 8.66667 4.98695 8.7369 4.86193 8.86193C4.7369 8.98695 4.66667 9.15652 4.66667 9.33333V14M4.66667 2V4.66667C4.66667 4.84348 4.7369 5.01305 4.86193 5.13807C4.98695 5.2631 5.15652 5.33333 5.33333 5.33333H10M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z"
              stroke="#FAFAFA"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Сохранить копию шаблона
        </Button>
      );
    } else {
      // Existing template: Show all template buttons including dropdown
      return (
        <>
          <Button variant="primary" onClick={handleSaveChanges}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.3333 14V9.33333C11.3333 9.15652 11.2631 8.98695 11.1381 8.86193C11.013 8.7369 10.8435 8.66667 10.6667 8.66667H5.33333C5.15652 8.66667 4.98695 8.7369 4.86193 8.86193C4.7369 8.98695 4.66667 9.15652 4.66667 9.33333V14M4.66667 2V4.66667C4.66667 4.84348 4.7369 5.01305 4.86193 5.13807C4.98695 5.2631 5.15652 5.33333 5.33333 5.33333H10M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z"
                stroke="#FAFAFA"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Сохранить изменения
          </Button>
          <Button variant="outline" onClick={handleShareCP}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.66602 7.99998V13.3333C2.66602 13.6869 2.80649 14.0261 3.05654 14.2761C3.30659 14.5262 3.64573 14.6666 3.99935 14.6666H11.9993C12.353 14.6666 12.6921 14.5262 12.9422 14.2761C13.1922 14.0261 13.3327 13.6869 13.3327 13.3333V7.99998M10.666 3.99998L7.99935 1.33331M7.99935 1.33331L5.33268 3.99998M7.99935 1.33331V9.99998"
                stroke="#18181B"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Поделиться КП
          </Button>
          <TemplateActionsDropdown
            onCopy={handleCopyTemplate}
            onDelete={handleDeleteTemplate}
          />
        </>
      );
    }
  };

    async function deleteTemplate() {
        try {
            await apiCP.delete(`/offer/v1/${navigationState.id}/`);
        } catch (err) {
            console.log(err);
        }
    }

    async function copyTemplate() {
        try {
            await apiCP.post(`/offer/v1/${navigationState.id}/copy/`);
        } catch (err) {
            console.log(err);
        }
    }

    // Determine page mode based on navigation state or URL parameters
    const pageMode: PageMode =
        navigationState.isCommercialOffer || urlType === "commercial-offer"
            ? "COMMERCIAL_OFFER"
            : "TEMPLATE";

    // Extract data based on page mode
    const pageData = {
        name: navigationState.templateName || "Коммерческие предложения",
        status: navigationState.templateStatus || "Создано",
        variants: navigationState.templateVariants || [],
        isNew: navigationState.isNewTemplate || false,
        isCopy: navigationState.isTemplateCopy || false,
    };

    useEffect(() => {
        console.log(`isNewTemplate: ${isNewTemplate}`);
        console.log(`isTemplateCopy: ${isTemplateCopy}`);
        console.log(`pageData.isCopy: ${pageData.isCopy}`);
    }, [pageData.isCopy])

    // Legacy variables for backward compatibility (can be removed after refactoring)
    const templateName = pageData.name;
    const templateStatus = pageData.status;
    const templateVariants = pageData.variants;
    const isNewTemplate = pageData.isNew;
    const isTemplateCopy = pageData.isCopy;

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    // Get status color based on status (handles both template and commercial offer statuses)
    const getStatusColor = (status: string): string => {
        switch (status) {
            // Commercial Offer statuses
            case "Создано":
                return "bg-neutral-500";
            case "Согласование":
                return "bg-amber-500";
            case "Отправлено":
                return "bg-blue-500";
            case "Отказ":
                return "bg-rose-500";
            case "Продано":
                return "bg-teal-500";
            // Template statuses
            case "Создан":
                return "bg-teal-500";
            case "Черновик":
                return "bg-neutral-500";
            default:
                return "bg-neutral-500";
        }
    };

    const getStatusTextColor = (status: string): string => {
        switch (status) {
            // Commercial Offer statuses
            case "Создано":
                return "text-neutral-500";
            case "Согласование":
                return "text-amber-500";
            case "Отправлено":
                return "text-blue-500";
            case "Отказ":
                return "text-rose-500";
            case "Продано":
                return "text-teal-500";
            // Template statuses
            case "Создан":
                return "text-teal-500";
            case "Черновик":
                return "text-neutral-500";
            default:
                return "text-neutral-500";
        }
    };

    // ============================================================================
    // BUTTON RENDERING FUNCTIONS
    // ============================================================================

    // Render buttons for TEMPLATE mode
    const renderTemplateButtons = () => {
        if (pageData.isNew) {
            // New template: Show only "Сохранить шаблон" button
            return (
                <Button variant="primary" onClick={handleSaveChanges}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.3333 14V9.33333C11.3333 9.15652 11.2631 8.98695 11.1381 8.86193C11.013 8.7369 10.8435 8.66667 10.6667 8.66667H5.33333C5.15652 8.66667 4.98695 8.7369 4.86193 8.86193C4.7369 8.98695 4.66667 9.15652 4.66667 9.33333V14M4.66667 2V4.66667C4.66667 4.84348 4.7369 5.01305 4.86193 5.13807C4.98695 5.2631 5.15652 5.33333 5.33333 5.33333H10M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z"
                            stroke="#FAFAFA"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Сохранить шаблон
                </Button>
            );
        } else if (pageData.isCopy) {
            // Template copy: Show only "Сохранить копию шаблона" button
            return (
                <Button variant="primary" onClick={handleSaveChanges}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.3333 14V9.33333C11.3333 9.15652 11.2631 8.98695 11.1381 8.86193C11.013 8.7369 10.8435 8.66667 10.6667 8.66667H5.33333C5.15652 8.66667 4.98695 8.7369 4.86193 8.86193C4.7369 8.98695 4.66667 9.15652 4.66667 9.33333V14M4.66667 2V4.66667C4.66667 4.84348 4.7369 5.01305 4.86193 5.13807C4.98695 5.2631 5.15652 5.33333 5.33333 5.33333H10M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z"
                            stroke="#FAFAFA"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Сохранить копию шаблона
                </Button>
            );
        } else {
            // Existing template: Show all template buttons including dropdown
            return (
                <>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M11.3333 14V9.33333C11.3333 9.15652 11.2631 8.98695 11.1381 8.86193C11.013 8.7369 10.8435 8.66667 10.6667 8.66667H5.33333C5.15652 8.66667 4.98695 8.7369 4.86193 8.86193C4.7369 8.98695 4.66667 9.15652 4.66667 9.33333V14M4.66667 2V4.66667C4.66667 4.84348 4.7369 5.01305 4.86193 5.13807C4.98695 5.2631 5.15652 5.33333 5.33333 5.33333H10M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z"
                                stroke="#FAFAFA"
                                strokeWidth="1.33"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Сохранить изменения
                    </Button>
                    <Button variant="outline" onClick={handleShareCP}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2.66602 7.99998V13.3333C2.66602 13.6869 2.80649 14.0261 3.05654 14.2761C3.30659 14.5262 3.64573 14.6666 3.99935 14.6666H11.9993C12.353 14.6666 12.6921 14.5262 12.9422 14.2761C13.1922 14.0261 13.3327 13.6869 13.3327 13.3333V7.99998M10.666 3.99998L7.99935 1.33331M7.99935 1.33331L5.33268 3.99998M7.99935 1.33331V9.99998"
                                stroke="#18181B"
                                strokeWidth="1.33"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Поделиться КП
                    </Button>
                    <TemplateActionsDropdown
                        onCopy={handleCopyTemplate}
                        onDelete={handleDeleteTemplate}
                    />
                </>
            );
        }
    };

    // Render buttons for COMMERCIAL_OFFER mode
    const renderCommercialOfferButtons = () => {
        return (
            <>
                <Button variant="primary" onClick={handleSaveChanges}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.3333 14V9.33333C11.3333 9.15652 11.2631 8.98695 11.1381 8.86193C11.013 8.7369 10.8435 8.66667 10.6667 8.66667H5.33333C5.15652 8.66667 4.98695 8.7369 4.86193 8.86193C4.7369 8.98695 4.66667 9.15652 4.66667 9.33333V14M4.66667 2V4.66667C4.66667 4.84348 4.7369 5.01305 4.86193 5.13807C4.98695 5.2631 5.15652 5.33333 5.33333 5.33333H10M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z"
                            stroke="#FAFAFA"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Сохранить изменения
                </Button>
                <Button variant="outline" onClick={handleShareCP}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M2.66602 7.99998V13.3333C2.66602 13.6869 2.80649 14.0261 3.05654 14.2761C3.30659 14.5262 3.64573 14.6666 3.99935 14.6666H11.9993C12.353 14.6666 12.6921 14.5262 12.9422 14.2761C13.1922 14.0261 13.3327 13.6869 13.3327 13.3333V7.99998M10.666 3.99998L7.99935 1.33331M7.99935 1.33331L5.33268 3.99998M7.99935 1.33331V9.99998"
                            stroke="#18181B"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Поделиться КП
                </Button>
                {/* Three dots button for commercial offers - opens Version History */}
                <button
                    type="button"
                    className="w-9 h-9 flex-center bg-white border border-base-border rounded-md shadow-outline hover:bg-base-muted"
                    onClick={() => setShowVersionHistoryModal(true)}
                    aria-label="Дополнительно"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8.00065 8.66669C8.36884 8.66669 8.66732 8.36821 8.66732 8.00002C8.66732 7.63183 8.36884 7.33335 8.00065 7.33335C7.63246 7.33335 7.33398 7.63183 7.33398 8.00002C7.33398 8.36821 7.63246 8.66669 8.00065 8.66669Z"
                            stroke="#18181B"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M8.00065 4.00002C8.36884 4.00002 8.66732 3.70154 8.66732 3.33335C8.66732 2.96516 8.36884 2.66669 8.00065 2.66669C7.63246 2.66669 7.33398 2.96516 7.33398 3.33335C7.33398 3.70154 7.63246 4.00002 8.00065 4.00002Z"
                            stroke="#18181B"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M8.00065 13.3334C8.36884 13.3334 8.66732 13.0349 8.66732 12.6667C8.66732 12.2985 8.36884 12 8.00065 12C7.63246 12 7.33398 12.2985 7.33398 12.6667C7.33398 13.0349 7.63246 13.3334 8.00065 13.3334Z"
                            stroke="#18181B"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </>
        );
    };

    const [_selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [_showAddProductModal, setShowAddProductModal] = useState(false);
    const [_editingCell, setEditingCell] = useState<{
        rowId: string;
        field: "name" | "amount" | "cost";
    } | null>(null);
    const [_editingCellValue, setEditingCellValue] = useState<string>("");
    const [_editingHeader, setEditingHeader] = useState<
        "name" | "amount" | "cost" | "costAmount" | null
    >(null);
    const [_editingHeaderValue, setEditingHeaderValue] = useState<string>("");
    const [tableHeaders, setTableHeaders] = useState({
        name: "Название",
        amount: "Кол-во, шт",
        cost: "Цена, ₽",
        costAmount: "Стоимость, ₽",
    });
    const [columnOrder, setColumnOrder] = useState<
        ("name" | "amount" | "cost" | "costAmount")[]
    >(["name", "amount", "cost", "costAmount"]);
    const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
    const [draggedRow, setDraggedRow] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastTitle, setToastTitle] = useState("Изменения сохранены");
    const [toastText, setToastText] = useState("КП сохранено!");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
    const [deleteItemName, setDeleteItemName] = useState<string>("");
    const [deleteItemType, setDeleteItemType] = useState<"main" | "group">(
        "main"
    );
    const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
    const [showDeleteVariantModal, setShowDeleteVariantModal] = useState(false);
    const [deleteVariantId, setDeleteVariantId] = useState<string | null>(null);
    const [deleteVariantName, setDeleteVariantName] = useState<string>("");
    const [editingVariantId, setEditingVariantId] = useState<string | null>(
        null
  // Render buttons for COMMERCIAL_OFFER mode
  const renderCommercialOfferButtons = () => {
    return (
      <>
        <Button variant="primary" onClick={handleSaveChanges}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3333 14V9.33333C11.3333 9.15652 11.2631 8.98695 11.1381 8.86193C11.013 8.7369 10.8435 8.66667 10.6667 8.66667H5.33333C5.15652 8.66667 4.98695 8.7369 4.86193 8.86193C4.7369 8.98695 4.66667 9.15652 4.66667 9.33333V14M4.66667 2V4.66667C4.66667 4.84348 4.7369 5.01305 4.86193 5.13807C4.98695 5.2631 5.15652 5.33333 5.33333 5.33333H10M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z"
              stroke="#FAFAFA"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Сохранить изменения
        </Button>
        <Button variant="outline" onClick={handleShareCP}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.66602 7.99998V13.3333C2.66602 13.6869 2.80649 14.0261 3.05654 14.2761C3.30659 14.5262 3.64573 14.6666 3.99935 14.6666H11.9993C12.353 14.6666 12.6921 14.5262 12.9422 14.2761C13.1922 14.0261 13.3327 13.6869 13.3327 13.3333V7.99998M10.666 3.99998L7.99935 1.33331M7.99935 1.33331L5.33268 3.99998M7.99935 1.33331V9.99998"
              stroke="#18181B"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Поделиться КП
        </Button>
        {/* Three dots button for commercial offers - opens Version History */}
        <button
          type="button"
          className="w-9 h-9 flex-center bg-white border border-base-border rounded-md shadow-outline hover:bg-base-muted"
          onClick={() => setShowVersionHistoryModal(true)}
          aria-label="Дополнительно"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00065 8.66669C8.36884 8.66669 8.66732 8.36821 8.66732 8.00002C8.66732 7.63183 8.36884 7.33335 8.00065 7.33335C7.63246 7.33335 7.33398 7.63183 7.33398 8.00002C7.33398 8.36821 7.63246 8.66669 8.00065 8.66669Z"
              stroke="#18181B"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.00065 4.00002C8.36884 4.00002 8.66732 3.70154 8.66732 3.33335C8.66732 2.96516 8.36884 2.66669 8.00065 2.66669C7.63246 2.66669 7.33398 2.96516 7.33398 3.33335C7.33398 3.70154 7.63246 4.00002 8.00065 4.00002Z"
              stroke="#18181B"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.00065 13.3334C8.36884 13.3334 8.66732 13.0349 8.66732 12.6667C8.66732 12.2985 8.36884 12 8.00065 12C7.63246 12 7.33398 12.2985 7.33398 12.6667C7.33398 13.0349 7.63246 13.3334 8.00065 13.3334Z"
              stroke="#18181B"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </>
    );
  };

  const [_selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [_showAddProductModal, setShowAddProductModal] = useState(false);
  const [_editingCell, setEditingCell] = useState<{
    rowId: string;
    field: "name" | "amount" | "cost";
  } | null>(null);
  const [_editingCellValue, setEditingCellValue] = useState<string>("");
  const [_editingHeader, setEditingHeader] = useState<
    "name" | "amount" | "cost" | "costAmount" | null
  >(null);
  const [_editingHeaderValue, setEditingHeaderValue] = useState<string>("");
  const [tableHeaders, setTableHeaders] = useState({
    name: "Название",
    amount: "Кол-во, шт",
    cost: "Цена, ₽",
    costAmount: "Стоимость, ₽",
  });
  const [columnOrder, setColumnOrder] = useState<
    ("name" | "amount" | "cost" | "costAmount")[]
  >(["name", "amount", "cost", "costAmount"]);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [draggedRow, setDraggedRow] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState("Изменения сохранены");
  const [toastText, setToastText] = useState("КП сохранено!");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>("");
  const [deleteItemType, setDeleteItemType] = useState<"main" | "group">(
    "main"
  );
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
  const [showDeleteVariantModal, setShowDeleteVariantModal] = useState(false);
  const [deleteVariantId, setDeleteVariantId] = useState<string | null>(null);
  const [deleteVariantName, setDeleteVariantName] = useState<string>("");
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editingVariantValue, setEditingVariantValue] = useState<string>("");
  const [showAddCrmFieldsModal, setShowAddCrmFieldsModal] = useState(false);
  const [crmFields, setCrmFields] = useState<
    Array<{ id: string; name: string; value: string }>
  >([]);
  const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [deleteGroupName, setDeleteGroupName] = useState<string>("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");
  const [editableTemplateName, setEditableTemplateName] =
    useState<string>(templateName);
  const [editableStatus, setEditableStatus] = useState<string>(templateStatus);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const [selectedVersionDate, setSelectedVersionDate] = useState<string | null>(
    null
  );
  const [showEditAmountModal, setShowEditAmountModal] = useState(false);
  const [amountFields, setAmountFields] = useState<AmountField[]>([]);

  // Version history handlers
  const handleVersionSelect = (versionDate: string) => {
    setSelectedVersionDate(versionDate);
  };

  const handleVersionRestore = () => {
    // TODO: Implement version restoration logic
    console.log("Restoring version:", selectedVersionDate);
    setSelectedVersionDate(null);
  };

  const handleVersionDismiss = () => {
    setSelectedVersionDate(null);
  };

  // Edit Amount handlers
  const handleOpenEditAmount = () => {
    setShowEditAmountModal(true);
  };

  const handleSaveAmountFields = (fields: AmountField[]) => {
    setAmountFields(fields);
    setShowEditAmountModal(false);
    // TODO: Apply the amount fields to the calculation
    console.log("Amount fields saved:", fields);
  };

  // Status management
  const getAvailableStatuses = () => {
    if (pageMode === "COMMERCIAL_OFFER") {
      return [
        { value: "Создано", label: "Создано" },
        { value: "Согласование", label: "Согласование" },
        { value: "Отправлено", label: "Отправлено" },
        { value: "Отказ", label: "Отказ" },
        { value: "Продано", label: "Продано" },
      ];
    } else {
      return [
        { value: "Создан", label: "Создан" },
        { value: "Черновик", label: "Черновик" },
      ];
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setEditableStatus(newStatus);
    setShowStatusDropdown(false);
  };

  // Group deletion handlers
  const handleConfirmDeleteGroup = async () => {
    if (deleteGroupId) {
      // Delete from active variant's product groups
      await deleteGroup(deleteGroupId);
      getGroups();
    }
    setShowDeleteGroupModal(false);
    setDeleteGroupId(null);
    setDeleteGroupName("");
  };

  const handleCancelDeleteGroup = () => {
    setShowDeleteGroupModal(false);
    setDeleteGroupId(null);
    setDeleteGroupName("");
  };

  type VariantType = {
    id: string;
    name: string;
    isRecommended: boolean;
    isHidden: boolean;
    tableRows: Array<{
      id: string;
      name: string;
      amount: string;
      cost: string;
      costAmount: string;
    }>;
    productGroups: Array<{
      id: string;
      name: string;
      products: Array<{
        id: string;
        name: string;
        amount: string;
        cost: string;
        costAmount: string;
      }>;
    }>;
  };

  const [variants, setVariants] = useState<VariantType[]>(
    templateVariants.length > 0 ? (templateVariants as VariantType[]) : []
  );

  useEffect(() => {
    console.log("########");
    console.log(variants);
  }, [variants]);
  useEffect(() => {
    variants.forEach((variant: VariantType) => {
      if (variant.id === activeVariantId) {
        variant.productGroups.forEach((group: any) => {
          getProducts(group.id);
        });
      }
    });
  }, [variants]);

  const [activeVariantId, setActiveVariantId] = useState<string>(
    templateVariants.length > 0
      ? (templateVariants[0] as VariantType).id
      : "variant-1"
  );

  useEffect(() => {
    getGroups();
  }, [activeVariantId]);

  const handleSelectAll = () => {
    const activeVariant = getActiveVariant();
    const activeTableRows = activeVariant?.tableRows || [];
    setSelectedRows((prev) =>
      prev.size === activeTableRows.length
        ? new Set()
        : new Set(activeTableRows.map((r) => r.id))
    );
  };

  const handleRowSelect = (rowId: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const handleOpenAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleAddProducts = (
    selectedProducts: Array<{
      id: string;
      name: string;
      price: string;
      sku: string;
      description: string;
      image: string;
    }>
  ) => {
    const newRows = selectedProducts.map((product, index) => {
      const cost = parseFloat(product.price) || 0;
      const amount = 1;
      const costAmount = cost * amount;

      return {
        id: `${Date.now()}-${index}`,
        name: product.name,
        amount: amount.toString(),
        cost: product.price,
        costAmount: costAmount.toString(),
      };
    });

    // Add to active variant's table rows
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === activeVariantId
          ? {
              ...variant,
              tableRows: [...variant.tableRows, ...newRows],
            }
          : variant
      )
    );
  };

  const handleQuickAdd = () => {
    const cost = 1;
    const amount = 1;
    const costAmount = cost * amount;

    const newRow = {
      id: `${Date.now()}`,
      name: "Название товара",
      amount: amount.toString(),
      cost: cost.toString(),
      costAmount: costAmount.toString(),
    };

    // Add to active variant's table rows
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === activeVariantId
          ? { ...variant, tableRows: [...variant.tableRows, newRow] }
          : variant
      )
    );
  };

  const handleAddGroup = async () => {
    const activeVariant = getActiveVariant();
    const newGroup = {
      id: `group-${Date.now()}`,
      name: `Группа ${(activeVariant?.productGroups?.length || 0) + 1}`,
      products: [],
    };

    // Add to active variant's product groups
    await createGroup(newGroup.name);
    getGroups();
  };

  const handleAddVariant = async () => {
    const newVariant = {
      id: `variant-${Date.now()}`,
      name: `Вариант ${variants.length + 1}`,
      isRecommended: false,
      isHidden: false,
      tableRows: [],
      productGroups: [],
    };

    const option = {
      name: newVariant.name,
      is_recommende: newVariant.isRecommended,
      is_hidden: newVariant.isHidden,
    };

    await addOption(option);
    getOptions();
    setActiveVariantId(newVariant.id);
  };

  const handleVariantToggle = async (
    variantId: string,
    field: "isRecommended" | "isHidden"
  ) => {
    await editOption(field);
    getOptions();
  };

  const handleDeleteVariant = async (variantId: string) => {
    const variant = variants.find((v) => v.id === variantId);
    if (variant) {
      setDeleteVariantId(variantId);
      setDeleteVariantName(variant.name);
      setShowDeleteVariantModal(true);
    }
  };

  const getActiveVariant = () => {
    return variants.find((variant) => variant.id === activeVariantId);
  };

  const calculateVariantTotal = (variantId: string) => {
    const variant = variants.find((v) => v.id === variantId);
    if (!variant) return 0;

    let total = 0;

    // Calculate from table rows
    variant.tableRows.forEach((row) => {
      const costAmount = parseFloat(row.costAmount) || 0;
      total += costAmount;
    });

    // Calculate from product groups
    variant.productGroups.forEach((group) => {
      group.products.forEach((product) => {
        const amount = parseFloat(product.amount) || 0;
        const cost = parseFloat(product.cost) || 0;
        total += amount * cost;
      });
    });

    return total;
  };

  const handleAddProductsToGroup = async (
    groupId: string,
    selectedProducts: Array<{
      id: string;
      name: string;
      price: string;
      sku: string;
      description: string;
      image: string;
    }>
  ) => {
    const newRows = selectedProducts.map((product, index) => {
      const cost = parseFloat(product.price) || 0;
      const amount = 1;
      const costAmount = cost * amount;

      return {
        id: `${Date.now()}-${index}`,
        name: product.name,
        amount: amount.toString(),
        cost: product.price,
        costAmount: costAmount.toString(),
      };
    });

    const handleSaveChanges = () => {
        if (isNewTemplate) {
            editOffer();
            // For new templates, save and navigate to templates page
            setToastTitle("Шаблон создан");
            setToastText("Новый шаблон успешно создан!");
            setShowToast(true);

            // Create new template object to add to the table
            const newTemplate = {
                id: `template-${Date.now()}`,
                name: templateName,
                status: "Черновик",
                variants: variants,
            };

            // Navigate back to templates page with new template data
            setTimeout(() => {
                navigate("/templates", {
                    state: {
                        newTemplate: newTemplate,
                        isNewTemplate: true,
                    },
                });
            }, 1000);
        } else if (isTemplateCopy) {
            // For template copies, save and navigate to templates page
            // Don't show toast here - it will be shown in Templates page

            // Create new template object to add to the table
            // Remove "Копия " prefix from the name when saving
            const finalName = templateName.startsWith("Копия ")
                ? templateName.substring(6) // Remove "Копия " (6 characters)
                : templateName;

            const copiedTemplate = {
                id: `template-${Date.now()}`,
                name: finalName,
                status: "Черновик",
                variants: variants,
            };

            // Navigate back to templates page with copied template data
            setTimeout(() => {
                navigate("/templates", {
                    state: {
                        newTemplate: copiedTemplate,
                        isTemplateCopy: true,
                    },
                });
            }, 1000);
        } else {
            editOffer();
            // For existing templates, just show save confirmation
            setShowToast(true);
            navigate("/");
        }
    await createProduct(
      groupId,
      selectedProducts.map((product: any) => product.id)
    );
    getProducts(groupId);
  };

  const handleQuickAddToGroup = async (groupId: string) => {
    const cost = 1;
    const amount = 1;
    const costAmount = cost * amount;

    const newRow = {
      id: `${Date.now()}`,
      name: "Название товара",
      amount: amount.toString(),
      cost: cost.toString(),
      costAmount: costAmount.toString(),
    };

    await createQuickProduct(groupId);
    getProducts(groupId);
  };

  const handleDeleteGroup = (groupId: string) => {
    const activeVariant = getActiveVariant();
    const group = activeVariant?.productGroups.find((g) => g.id === groupId);
    if (group) {
      setDeleteGroupId(groupId);
      setDeleteGroupName(group.name);
      setShowDeleteGroupModal(true);
    }
  };

  const handleEditGroup = (groupId: string) => {
    const activeVariant = getActiveVariant();
    const group = activeVariant?.productGroups.find((g) => g.id === groupId);
    if (group) {
      setEditingGroupId(groupId);
      setEditingGroupName(group.name);
    }
  };

  const handleSaveGroupName = async (groupId: string, newName: string) => {
    if (newName.trim()) {
      await editGroup(groupId, newName);
      getGroups();
    }
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const handleCancelGroupEdit = () => {
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const handleEditProductField = async (
    groupId: string,
    productId: string,
    field: string,
    newValue: string
  ) => {
    let newProduct = {};

    if (field === "name") newProduct = { name: newValue };
    else if (field === "amount") newProduct = { amount: Number(newValue) };
    else newProduct = { price: Number(newValue) };

    await editProduct(groupId, productId, newProduct);
    getProducts(groupId);
  };

  const handleReorderProducts = (
    groupId: string,
    newOrder: Array<{
      id: string;
      name: string;
      amount: string;
      cost: string;
      costAmount: string;
    }>
  ) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === activeVariantId
          ? {
              ...variant,
              productGroups: variant.productGroups.map((group) =>
                group.id === groupId ? { ...group, products: newOrder } : group
              ),
            }
          : variant
      )
    );
  };

  const handleDeleteProduct = (groupId: string, productId: string) => {
    const product = products.get(groupId)?.find((p) => p.id === productId);
    console.log(product);
    if (product) {
      setDeleteItemId(productId);
      setDeleteItemName(product.name);
      setDeleteItemType("group");
      setDeleteGroupId(groupId);
      setShowDeleteModal(true);
    }
  };

  const handleEditCell = (rowId: string, field: "name" | "amount" | "cost") => {
    const activeVariant = getActiveVariant();
    const row = activeVariant?.tableRows.find((r) => r.id === rowId);
    if (row) {
      setEditingCell({ rowId, field });
      // For cost field, remove any formatting (spaces) to show clean numeric value
      const value =
        field === "cost"
          ? (row[field] || "").replace(/\s/g, "")
          : row[field] || "";
      setEditingCellValue(value);
    }
  };

  const handleSaveCellEdit = (
    rowId: string,
    field: "name" | "amount" | "cost",
    newValue: string
  ) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === activeVariantId
          ? {
              ...variant,
              tableRows: variant.tableRows.map((row) => {
                if (row.id === rowId) {
                  const updatedRow = {
                    ...row,
                    [field]: newValue,
                  };
                  // Recalculate costAmount if amount or cost changed
                  if (field === "amount" || field === "cost") {
                    const amount =
                      parseFloat(field === "amount" ? newValue : row.amount) ||
                      0;
                    const cost =
                      parseFloat(field === "cost" ? newValue : row.cost) || 0;
                    updatedRow.costAmount = (amount * cost).toString();
                  }
                  return updatedRow;
                }
                return row;
              }),
            }
          : variant
      )
    );
    setEditingCell(null);
    setEditingCellValue("");
  };

  const handleCancelCellEdit = () => {
    setEditingCell(null);
    setEditingCellValue("");
  };

  const handleEditHeader = (
    headerField: "name" | "amount" | "cost" | "costAmount"
  ) => {
    setEditingHeader(headerField);
    setEditingHeaderValue(tableHeaders[headerField]);
  };

  const handleSaveHeaderEdit = (
    headerField: "name" | "amount" | "cost" | "costAmount",
    newValue: string
  ) => {
    if (newValue.trim()) {
      setTableHeaders((prev) => ({
        ...prev,
        [headerField]: newValue.trim(),
      }));
    }
    setEditingHeader(null);
    setEditingHeaderValue("");
  };

  const handleCancelHeaderEdit = () => {
    setEditingHeader(null);
    setEditingHeaderValue("");
  };

  // Column drag and drop handlers
  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    if (columnId === "name") return; // Don't allow dragging name column
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (
      !draggedColumn ||
      draggedColumn === targetColumnId ||
      targetColumnId === "name"
    )
      return;

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(
      draggedColumn as "name" | "amount" | "cost" | "costAmount"
    );
    const targetIndex = newOrder.indexOf(
      targetColumnId as "name" | "amount" | "cost" | "costAmount"
    );

    // Remove dragged column and insert at target position
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(
      targetIndex,
      0,
      draggedColumn as "name" | "amount" | "cost" | "costAmount"
    );

    setColumnOrder(newOrder);
    setDraggedColumn(null);
  };

  // Row drag and drop handlers
  const handleRowDragStart = (e: React.DragEvent, rowId: string) => {
    setDraggedRow(rowId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleRowDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleRowDrop = (e: React.DragEvent, targetRowId: string) => {
    e.preventDefault();
    if (!draggedRow || draggedRow === targetRowId) return;

    const activeVariant = getActiveVariant();
    if (!activeVariant) return;

    const newRows = [...activeVariant.tableRows];
    const draggedIndex = newRows.findIndex((row) => row.id === draggedRow);
    const targetIndex = newRows.findIndex((row) => row.id === targetRowId);

    // Remove dragged row and insert at target position
    const [draggedRowData] = newRows.splice(draggedIndex, 1);
    newRows.splice(targetIndex, 0, draggedRowData);

    // Update the variants state
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === activeVariantId
          ? { ...variant, tableRows: newRows }
          : variant
      )
    );

    // Template dropdown handlers
    const handleCopyTemplate = async () => {
        await copyTemplate();
        // Create a copy of the current template with modified name
        const copiedTemplate = {
            templateName: `Копия ${templateName}`,
            templateStatus: "Черновик",
            templateVariants: variants,
    setDraggedRow(null);
  };

  const handleSaveChanges = () => {
    if (isNewTemplate) {
      // For new templates, save and navigate to templates page
      setToastTitle("Шаблон создан");
      setToastText("Новый шаблон успешно создан!");
      setShowToast(true);

      // Create new template object to add to the table
      const newTemplate = {
        id: `template-${Date.now()}`,
        name: templateName,
        status: "Черновик",
        variants: variants,
      };

      // Navigate back to templates page with new template data
      setTimeout(() => {
        navigate("/templates", {
          state: {
            newTemplate: newTemplate,
            isNewTemplate: true,
          },
        });
      }, 1000);
    } else if (isTemplateCopy) {
      // For template copies, save and navigate to templates page
      // Don't show toast here - it will be shown in Templates page

      // Create new template object to add to the table
      // Remove "Копия " prefix from the name when saving
      const finalName = templateName.startsWith("Копия ")
        ? templateName.substring(6) // Remove "Копия " (6 characters)
        : templateName;

      const copiedTemplate = {
        id: `template-${Date.now()}`,
        name: finalName,
        status: "Черновик",
        variants: variants,
      };

      // Navigate back to templates page with copied template data
      setTimeout(() => {
        navigate("/templates", {
          state: {
            newTemplate: copiedTemplate,
            isTemplateCopy: true,
          },
        });
      }, 1000);
    } else {
      editOffer();
      // For existing templates, just show save confirmation
      setShowToast(true);
      navigate("/");
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const activeVariant = getActiveVariant();
    const item = activeVariant?.tableRows.find((row) => row.id === itemId);
    if (item) {
      setDeleteItemId(itemId);
      setDeleteItemName(item.name);
      setDeleteItemType("main");
      setDeleteGroupId(null);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteItemId) {
      if (deleteItemType === "main") {
        // Delete from active variant's table rows
        setVariants((prev) =>
          prev.map((variant) =>
            variant.id === activeVariantId
              ? {
                  ...variant,
                  tableRows: variant.tableRows.filter(
                    (row) => row.id !== deleteItemId
                  ),
                }
              : variant
          )
        );
      } else if (deleteItemType === "group" && deleteGroupId) {
        await deleteProduct(deleteItemId);
        getProducts(deleteGroupId);
      }
    }
    setShowDeleteModal(false);
    setDeleteItemId(null);
    setDeleteItemName("");
    setDeleteItemType("main");
    setDeleteGroupId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteItemId(null);
    setDeleteItemName("");
    setDeleteItemType("main");
    setDeleteGroupId(null);
  };

  const handleConfirmDeleteVariant = async () => {
    if (deleteVariantId) {
      await deleteOption(deleteVariantId);
      getOptions();
    }
    setShowDeleteVariantModal(false);
    setDeleteVariantId(null);
    setDeleteVariantName("");
  };

  const handleCancelDeleteVariant = () => {
    setShowDeleteVariantModal(false);
    setDeleteVariantId(null);
    setDeleteVariantName("");
  };

  const handleEditVariantName = (variantId: string) => {
    const variant = variants.find((v) => v.id === variantId);
    if (variant) {
      setEditingVariantId(variantId);
      setEditingVariantValue(variant.name);
    }
  };

  const handleSaveVariantEdit = async (variantId: string, newName: string) => {
    await editOption("");
    getOptions();
    setEditingVariantId(null);
    setEditingVariantValue(newName);
  };

  const handleCancelVariantEdit = () => {
    setEditingVariantId(null);
    setEditingVariantValue("");
  };

  const handleOpenAddCrmFields = () => {
    setShowAddCrmFieldsModal(true);
  };

  const handleUpdateCrmFields = async (
    updatedFields: Array<{ id: string; name: string }>
  ) => {
    for (let i = 0; i < updatedFields.length; i++) {
      await addCrmFields(updatedFields[i].name);
    }
    getCrmFields();

    // Show toast with CRM fields integration message
    setToastTitle("Поля интегрированы");
    setToastText(`${updatedFields.length} полей интегрированы`);
    setShowToast(true);
  };

  // Template dropdown handlers
  const handleCopyTemplate = () => {
    // Create a copy of the current template with modified name
    const copiedTemplate = {
      templateName: `Копия ${templateName}`,
      templateStatus: "Черновик",
      templateVariants: variants,
      isTemplateCopy: true,
    };

    const handleConfirmDeleteTemplate = async () => {
        setToastTitle("Шаблон удален");
        setToastText("Шаблон успешно удален!");
        setShowToast(true);
        setShowDeleteTemplateModal(false);
        await deleteTemplate();
        // Navigate back to templates page after deletion
        setTimeout(() => {
            navigate("/templates");
        }, 1000);
    // Navigate to details page with copied template data
    navigate("/details?type=template", {
      state: copiedTemplate,
    });
  };

  const handleDeleteTemplate = () => {
    setShowDeleteTemplateModal(true);
  };

  const handleConfirmDeleteTemplate = () => {
    setToastTitle("Шаблон удален");
    setToastText("Шаблон успешно удален!");
    setShowToast(true);
    setShowDeleteTemplateModal(false);
    // Navigate back to templates page after deletion
    setTimeout(() => {
      navigate("/templates");
    }, 1000);
  };

  const handleCancelDeleteTemplate = () => {
    setShowDeleteTemplateModal(false);
  };

  // Share CP handler
  const handleShareCP = () => {
    // Prepare share data
    const shareData = {
      name: editableTemplateName,
      status: editableStatus,
      variants: variants,
      introduction: introduction,
      crmFields: crmFields,
    };

    // Navigate to share page with data
    navigate("/preview", {
      state: {
        shareData: shareData,
        pageMode: pageMode,
      },
    });
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Close status dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
    };

    if (showStatusDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return (
        <div className="space-y-5 p-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {/* Back button */}
                    <button
                        onClick={() => {
                            if (isNewTemplate || pageData.isCopy) deleteTemplate();
                            navigate(-1)
                        }}
                        className="hover:bg-base-border/50 rounded-md p-1 transition-colors duration-200"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.001 19L5.00098 12M5.00098 12L12.001 5M5.00098 12H19.001"
                                stroke="#71717A"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>

                    <h1 className="text-xl font-medium">
                        {editableTemplateName}
                    </h1>

                    {/* Status - only show for existing templates (not new or copies) */}
                    {!isNewTemplate && !isTemplateCopy && (
                        <div className="relative" ref={statusDropdownRef}>
                            <button
                                type="button"
                                onClick={() =>
                                    setShowStatusDropdown(!showStatusDropdown)
                                }
                                className={`font-semibold text-xs/4 text-white ${getStatusColor(
                                    editableStatus
                                )} rounded-md shadow-primary py-0.5 px-2.5 border-none outline-none cursor-pointer flex items-center gap-1`}
                            >
                                <span>{editableStatus}</span>
                                <svg
                                    className={`w-3 h-3 transition-transform ${
                                        showStatusDropdown ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {showStatusDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute z-10 mt-1 bg-white border border-base-border rounded-md shadow-lg min-w-full"
                                    >
                                        {getAvailableStatuses().map(
                                            (status) => (
                                                <button
                                                    key={status.value}
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            status.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 text-left hover:bg-base-border transition-colors first:rounded-t-md last:rounded-b-md text-sm font-semibold ${getStatusTextColor(
                                                        status.value
                                                    )}`}
                                                >
                                                    {status.label}
                                                </button>
                                            )
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusDropdown]);

  return (
    <div className="space-y-5 p-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-base-border/50 rounded-md p-1 transition-colors duration-200"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.001 19L5.00098 12M5.00098 12L12.001 5M5.00098 12H19.001"
                stroke="#71717A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <h1 className="text-xl font-medium">{editableTemplateName}</h1>

          {/* Status - only show for existing templates (not new or copies) */}
          {!isNewTemplate && !isTemplateCopy && (
            <div className="relative" ref={statusDropdownRef}>
              <button
                type="button"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className={`font-semibold text-xs/4 text-white ${getStatusColor(
                  editableStatus
                )} rounded-md shadow-primary py-0.5 px-2.5 border-none outline-none cursor-pointer flex items-center gap-1`}
              >
                <span>{editableStatus}</span>
                <svg
                  className={`w-3 h-3 transition-transform ${
                    showStatusDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {showStatusDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 mt-1 bg-white border border-base-border rounded-md shadow-lg min-w-full"
                  >
                    {getAvailableStatuses().map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => handleStatusChange(status.value)}
                        className={`w-full px-3 py-2 text-left hover:bg-base-border transition-colors first:rounded-t-md last:rounded-b-md text-sm font-semibold ${getStatusTextColor(
                          status.value
                        )}`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ============================================================================
            BUTTON RENDERING - Mode-specific button logic
            ============================================================================ */}
        <div className="flex items-center gap-4">
          {pageMode === "TEMPLATE"
            ? renderTemplateButtons()
            : renderCommercialOfferButtons()}
        </div>
      </div>

      <div className="space-y-5">
        {/* Version History Reverter */}
        {selectedVersionDate && (
          <VersionReverter
            versionDate={selectedVersionDate}
            onRestore={handleVersionRestore}
            onDismiss={handleVersionDismiss}
          />
        )}
        <div className=""></div>
        <div className="flex items-stretch gap-5 bg-white border border-base-border rounded-md p-5">
          <div className="w-full space-y-6">
            <h3 className="font-medium text-xl/7">Общая информация</h3>

            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-2 text-sm/5">
                <label htmlFor="name" className="block text-sm/3.5">
                  Название КП
                </label>

                <input
                  type="text"
                  id="name"
                  className="w-full h-9 border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3"
                  value={editableTemplateName}
                  onChange={(e) => setEditableTemplateName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2 text-sm/5">
                <label htmlFor="name" className="block text-sm/3.5">
                  Вступление
                </label>

                <textarea
                  className="w-full h-28.5 resize-none border border-base-border outline-none focus:ring-2 ring-base-border placeholder:text-base-muted-foreground rounded-md px-3 py-2"
                  placeholder="Введите описание"
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="w-full space-y-6 border-l border-base-border pl-5">
            <div className="flex-between">
              <h3 className="font-medium text-xl/7">
                Интегрировать поля из CRM
              </h3>

              <Button variant="secondary" onClick={handleOpenAddCrmFields}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.33203 7.99998H12.6654M7.9987 3.33331V12.6666"
                    stroke="#18181B"
                    stroke-width="1.33"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {crmFields.length > 0 ? "Редактировать поля" : "Добавить поля"}
              </Button>
            </div>

            {/* Show placeholder text when no CRM fields exist */}
            {crmFields.length === 0 && (
              <p className="text-base-muted-foreground text-sm/5">
                В шаблоне нет интегрированных из CRM полей. Добавьте поля, чтобы
                видеть данные в шаблоне
              </p>
            )}

            {/* When CRM fields are added */}
            {crmFields.length > 0 && (
              <ul className="space-y-2 text-sm/5">
                {crmFields.map((field) => (
                  <li
                    key={field.id}
                    className="flex-between bg-base-muted rounded-lg p-2"
                  >
                    <span className="font-medium">{field.name}</span>
                    <span className="text-base-tartiary">
                      {field.value || "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white border border-base-border rounded-md p-5">
          <div className="flex-between">
            <h3 className="font-medium text-xl/7">Варианты КП</h3>

            <Button variant="secondary" onClick={handleAddVariant}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.33203 7.99998H12.6654M7.9987 3.33331V12.6666"
                  stroke="#18181B"
                  stroke-width="1.33"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Добавить вариант
            </Button>
          </div>

          {/* Variants Tabs */}
          <div className="border-b border-base-border mt-3 flex">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => {
                  setEditingVariantValue(variant.name);
                  setActiveVariantId(variant.id);
                }}
                className={`h-10 text-sm/3.5 font-medium border-b transition-colors duration-200 -mb-px px-4 flex items-center gap-2 ${
                  activeVariantId === variant.id
                    ? "text-base-chart-1 border-base-chart-1"
                    : "text-base-muted-foreground border-transparent hover:text-base-foreground"
                }`}
              >
                <span>{variant.name}</span>

                {/* Status indicators */}
                {variant.isHidden && (
                  <span className="text-xs px-2 py-0.5 rounded-full text-orange-400 bg-orange-100">
                    Скрыть
                  </span>
                )}

                {variant.isRecommended && (
                  <span className="text-xs px-2 py-0.5 rounded-full text-teal-500 bg-emerald-100">
                    Рекомендуемый
                  </span>
                )}
              </button>
            ))}
          </div>

          {getActiveVariant() && (
            <div className="flex-between bg-white border border-base-border rounded-md mt-6 p-5">
              <div className="flex items-center gap-2">
                {editingVariantId === activeVariantId ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingVariantValue}
                      onChange={(e) => setEditingVariantValue(e.target.value)}
                      className="text-xl/7 border border-base-border rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-base-border bg-white"
                      style={{
                        width: `${Math.max(
                          editingVariantValue.length * 12 + 40,
                          200
                        )}px`,
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveVariantEdit(
                            activeVariantId,
                            e.currentTarget.value
                          );
                        } else if (e.key === "Escape") {
                          handleCancelVariantEdit();
                        }
                      }}
                      autoFocus
                    />
                    {/* Save Button */}
                    <Button
                      variant="outline"
                      className="!size-8 shrink-0 shadow-sm !p-0 !bg-base-chart-1 border-base-chart-1 hover:bg-base-chart-1/90"
                      onClick={() =>
                        handleSaveVariantEdit(
                          activeVariantId,
                          editingVariantValue
                        )
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3346 4L6.0013 11.3333L2.66797 8"
                          stroke="white"
                          stroke-width="1.33"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </Button>
                    {/* Cancel Button */}
                    <Button
                      variant="outline"
                      className="!size-8 shrink-0 shadow-sm !p-0"
                      onClick={handleCancelVariantEdit}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.002 4L4.00195 12M4.00195 4L12.002 12"
                          stroke="#18181B"
                          stroke-width="1.33"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </Button>
                  </div>
                ) : (
                  <p className="text-xl/7">{getActiveVariant()?.name}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm/5 font-medium text-base-foreground py-2.5">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={getActiveVariant()?.isRecommended}
                      onChange={() =>
                        handleVariantToggle(activeVariantId, "isRecommended")
                      }
                    />
                    <div className="w-9 h-5 bg-base-border rounded-full peer peer-checked:bg-base-chart-1 transition-colors duration-300"></div>
                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-full shadow-toggle-track"></div>
                  </label>
                  Рекомендуемый вариант
                </div>
                <div className="flex items-center gap-2 text-sm/5 font-medium text-base-foreground py-2.5">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={getActiveVariant()?.isHidden}
                      onChange={() =>
                        handleVariantToggle(activeVariantId, "isHidden")
                      }
                    />
                    <div className="w-9 h-5 bg-base-border rounded-full peer peer-checked:bg-base-chart-1 transition-colors duration-300"></div>
                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-full shadow-toggle-track"></div>
                  </label>
                  Скрыть вариант
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleEditVariantName(activeVariantId)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_1698_18416)">
                      <path
                        d="M10.0007 3.33333L12.6673 6M14.1166 4.54126C14.4691 4.18888 14.6671 3.71091 14.6672 3.2125C14.6673 2.71409 14.4693 2.23607 14.1169 1.8836C13.7646 1.53112 13.2866 1.33307 12.7882 1.33301C12.2898 1.33295 11.8117 1.53088 11.4593 1.88326L2.56194 10.7826C2.40715 10.9369 2.29268 11.127 2.22861 11.3359L1.34794 14.2373C1.33071 14.2949 1.32941 14.3562 1.34417 14.4145C1.35894 14.4728 1.38922 14.5261 1.4318 14.5686C1.47439 14.6111 1.52769 14.6413 1.58605 14.656C1.6444 14.6707 1.70565 14.6693 1.76327 14.6519L4.66527 13.7719C4.87405 13.7084 5.06406 13.5947 5.21861 13.4406L14.1166 4.54126Z"
                        stroke="#18181B"
                        stroke-width="1.33"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1698_18416">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Изменить название
                </Button>
                <Button
                  variant="outline"
                  className="text-base-destructive"
                  onClick={() => handleDeleteVariant(activeVariantId)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 4.00004H14M12.6667 4.00004V13.3334C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3334V4.00004M5.33333 4.00004V2.66671C5.33333 2.00004 6 1.33337 6.66667 1.33337H9.33333C10 1.33337 10.6667 2.00004 10.6667 2.66671V4.00004M6.66667 7.33337V11.3334M9.33333 7.33337V11.3334"
                      stroke="#DC2626"
                      stroke-width="1.33"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span className="">Удалить вариант</span>
                </Button>
              </div>
            </div>
          )}

          {getActiveVariant() && (
            <div className="mt-8">
              {/* <div
                                className={`overflow-y-auto overflow-x-visible ${
                                    (getActiveVariant()?.tableRows?.length ||
                                        0) > 10
                                        ? "max-h-[600px]"
                                        : ""
                                }`}
                            >
                            </div> */}
              {/* 
                            <AddProductDropdown
                                onAddFromList={handleOpenAddProduct}
                                onQuickAdd={handleQuickAdd}
                            /> */}
              {/* <COVariantsDropdown /> */}
              {(getActiveVariant()?.productGroups || []).map((group) => (
                <ProductGroup
                  key={group.id}
                  groupId={group.id}
                  groupName={group.name}
                  products={products.get(group.id) ?? []}
                  onAddProducts={handleAddProductsToGroup}
                  onQuickAdd={handleQuickAddToGroup}
                  onDeleteGroup={handleDeleteGroup}
                  onEditGroup={handleEditGroup}
                  onEditProductField={handleEditProductField}
                  onDeleteProduct={handleDeleteProduct}
                  onSaveGroupName={handleSaveGroupName}
                  onCancelGroupEdit={handleCancelGroupEdit}
                  isEditing={editingGroupId === group.id}
                  editingName={editingGroupName}
                  onReorderProducts={handleReorderProducts}
                  tableHeaders={tableHeaders}
                />
              ))}
              <Button
                variant="secondary"
                className="mt-8"
                onClick={handleAddGroup}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.33594 7.99992H12.6693M8.0026 3.33325V12.6666"
                    stroke="#18181B"
                    stroke-width="1.33"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Добавить группу
              </Button>
            </div>
          )}

          <AnimatePresence>
            {/* Toast */}
            {showToast && (
              <motion.div
                initial={{ x: 48, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 48, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed top-2.5 right-2.5 z-[60]"
              >
                <ToastSuccess title={toastTitle} text={toastText} />
              </motion.div>
            )}

            {/* AddProduct Modal */}
            {/* {showAddProductModal && (
                            <AddProduct
                                isOpen={showAddProductModal}
                                onClose={() => setShowAddProductModal(false)}
                                onAddProducts={handleAddProducts}
                            />
                        )} */}

            {/* Delete Product Modal */}
            {showDeleteModal && (
              <DeleteConfirmation
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Удалить выбранный товар?"
                message={`Вы уверены, что хотите удалить «${deleteItemName}» из списка товаров?`}
                confirmText="Удалить"
                cancelText="Отмена"
              />
            )}

            {/* Delete Variant Modal */}
            {showDeleteVariantModal && (
              <DeleteConfirmation
                onClose={handleCancelDeleteVariant}
                onConfirm={handleConfirmDeleteVariant}
                title="Удалить вариант"
                message={`Вы уверены, что хотите удалить вариант «${deleteVariantName}»? Это действие нельзя отменить.`}
                confirmText="Удалить"
                cancelText="Отмена"
              />
            )}

            {/* Delete Group Modal */}
            {showDeleteGroupModal && (
              <DeleteConfirmation
                onClose={handleCancelDeleteGroup}
                onConfirm={handleConfirmDeleteGroup}
                title="Удалить группу товаров?"
                message={`Вы уверены, что хотите удалить группу «${deleteGroupName}»? Все товары в этой группе также будут удалены. Это действие нельзя отменить.`}
                confirmText="Удалить"
                cancelText="Отмена"
              />
            )}

            {/* AddCrmFields Modal */}
            {showAddCrmFieldsModal && navigationState?.id && (
              <AddCrmFields
                offerId={String(navigationState.id)}
                isOpen={showAddCrmFieldsModal}
                onClose={() => {
                  getCrmFields();
                  setShowAddCrmFieldsModal(false);
                }}
                onUpdateFields={handleUpdateCrmFields}
              />
            )}

            {/* Delete Template Modal */}
            {showDeleteTemplateModal && (
              <DeleteConfirmation
                onClose={handleCancelDeleteTemplate}
                onConfirm={handleConfirmDeleteTemplate}
                title="Удалить шаблон"
                message={`Вы уверены, что хотите удалить шаблон «${templateName}»? Это действие нельзя отменить.`}
                confirmText="Удалить"
                cancelText="Отмена"
              />
            )}

            {/* Version History Modal */}
            {showVersionHistoryModal && (
              <VersionHistory
                isOpen={showVersionHistoryModal}
                onClose={() => setShowVersionHistoryModal(false)}
                onVersionSelect={handleVersionSelect}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="relative z-50 flex-between bg-slate-50 border border-base-border rounded-b-md -mt-1 py-2.5 px-5">
          <p className="text-base-muted-foreground">Итоговая сумма</p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base-muted-foreground">
                {getActiveVariant()?.name || "Вариант 1"}:
              </span>
              <span className="font-medium">
                {calculateVariantTotal(activeVariantId).toLocaleString("ru-RU")}{" "}
                ₽
              </span>
            </div>

            <div className="relative">
              <Button variant="ghost" onClick={handleOpenEditAmount}>
                Редактировать сумму
              </Button>

              {/* Edit Amount Dropdown */}
              <EditAmount
                isOpen={showEditAmountModal}
                onClose={() => setShowEditAmountModal(false)}
                onSave={handleSaveAmountFields}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
