import { ReactNode } from "react";
import { BookOpenText } from "lucide-react";
import { HelmIcon } from "@/components/icons/helm";
import { IstioIcon } from "@/components/icons/istio";
import { KubernetesIcon } from "@/components/icons/kubernetes";
import { PrometheusIcon } from "@/components/icons/prometheus";
import { ArgoIcon } from "@/components/icons/argo";
import { GrafanaIcon } from "@/components/icons/grafana";
import getToolCategoryId from '../lib/getToolCategoryId';
import { CiliumIcon } from "@/components/icons/cilium";
import KGatewayIcon from "@/components/icons/kgateway";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  tags: string[];
  categoryId: string;
  provider: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  tools: Tool[];
}

interface ToolConfig {
  provider: string;
  description: string;
  component_type: string;
  component_version: number;
  version: number;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>;
}

// Function to load tools from configuration JSON
const loadToolsFromConfig = (): Tool[] => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const toolConfigs: ToolConfig[] = require("./tools.json");

    const tools = toolConfigs.map((config) => {
      // Determine the icon based on the provider prefix
      let icon: ReactNode;
      let tags: string[] = [];
      const categoryId = getToolCategoryId(config.provider);

      if (config.provider.includes("prometheus")) {
        icon = <PrometheusIcon className="w-10 h-10" />;
        tags = ["Prometheus", "Monitoring", "Observability"];
      } else if (config.provider.includes("k8s")) {
        icon = <KubernetesIcon className="w-10 h-10" />;
        tags = ["Kubernetes"];
      } else if (config.provider.includes("istio")) {
        icon = <IstioIcon className="w-10 h-10" />;
        tags = ["Istio"];
      } else if (config.provider.includes("docs")) {
        icon = <BookOpenText className="w-10 h-10" />;
        tags = ["Documentation", "Vector DB", "Search"];
      } else if (config.provider.includes("helm")) {
        icon = <HelmIcon className="w-10 h-10" />;
        tags = ["Helm"];
      } else if (config.provider.includes("argo")) {
        icon = <ArgoIcon className="w-10 h-10" />;
        tags = ["Argo"];
      } else if (config.provider.includes("grafana")) {
        icon = <GrafanaIcon className="w-10 h-10" />;
        tags = ["Grafana"];
      } else if (config.provider.includes("cilium")) {
        icon = <CiliumIcon className="w-10 h-10" />;
        tags = ["Cilium"];
      } else if (config.provider.includes("kgateway")) {
        icon = <KGatewayIcon className="w-10 h-10" />;
        tags = ["KGateway"];
      } else {
        // Default icon for other tools
        icon = <BookOpenText />;
        tags = ["Other"];
      }

      // Create a standardized tool object
      return {
        id: config.label.toLowerCase().replace(/\s+/g, "-"),
        name: config.label,
        description: config.description,
        icon,
        tags,
        categoryId,
        provider: config.provider,

      };
    });

    return tools.sort((a, b) => a.categoryId.localeCompare(b.categoryId));
  } catch (error) {
    console.error("Failed to load tools configuration:", error);
    return [];
  }
};

// Load tools from configuration
const tools: Tool[] = loadToolsFromConfig();

// Define all possible categories
const allCategories: Category[] = [
  {
    id: "documentation",
    name: "Documentation",
    description:
      "Tools for searching and managing documentation across different products and services",
    icon: <BookOpenText />,
    tools: tools.filter((tool) => tool.categoryId === "documentation"),
  },
  {
    id: "prometheus",
    name: "Prometheus",
    description:
      "Complete suite of tools for monitoring, querying, and managing Prometheus instances",
    icon: <PrometheusIcon className="w-10 h-10" />,
    tools: tools.filter((tool) => tool.categoryId === "prometheus"),
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    description: "Tools for managing and interacting with Kubernetes clusters",
    icon: <KubernetesIcon className="w-10 h-10" />,
    tools: tools.filter((tool) => tool.categoryId === "kubernetes"),
  },
  {
    id: "istio",
    name: "Istio",
    description: "Tools for managing and interacting with Istio service mesh",
    icon: <IstioIcon className="w-10 h-10" />,
    tools: tools.filter((tool) => tool.categoryId === "istio"),
  },
  {
    id: "helm",
    name: "Helm",
    description:
      "Tools for managing and interacting with Helm charts and repositories",
    icon: <HelmIcon className="w-10 h-10" />,
    tools: tools.filter((tool) => tool.categoryId === "helm"),
  },
  {
    id: "argo",
    name: "Argo",
    description:
      "Tools for managing and interacting with Argo projects and workflows",
    icon: <ArgoIcon className="w-10 h-10" />,
    tools: tools.filter((tool) => tool.categoryId === "argo"),
  },
  {
    id: "grafana",
    name: "Grafana",
    description:
      "Tools for managing and interacting with Grafana dashboards and data sources",
    icon: <GrafanaIcon className="w-10 h-10" />,
    tools: tools.filter((tool) => tool.categoryId === "grafana"),
  },
  {
    id: "cilium",
    name: "Cilium",
    description: "Tools for managing and interacting with Cilium service mesh",
    icon: <CiliumIcon className="w-10 h-10" />,
    tools: tools.filter((tool) => tool.categoryId === "cilium"),
  },
  {
    id: "other",
    name: "Other",
    description: "Other tools that don't fit into the other categories",
    icon: <BookOpenText className="w-10 h-10" />,
    tools: tools.filter((tool) => tool.categoryId === "other"),
  },
];

// Filter out categories with no tools
export const categories: Category[] = allCategories.filter(
  (category) => category.tools.length > 0
);

export const getAllTools = () => tools;
export const getToolByProvider = (provider: string) =>
  tools.find((tool) => tool.provider === provider);
export const getToolsByCategory = (categoryId: string) =>
  categories.find((cat) => cat.id === categoryId)?.tools || [];
export const getCategory = (categoryId: string) =>
  categories.find((cat) => cat.id === categoryId);
