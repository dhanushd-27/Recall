"use client";

import * as React from "react";
import { ChevronRight, FileText, Folder } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { ContentItem } from "@/lib/content";

export function AppSidebar({
  items,
  ...props
}: React.ComponentProps<typeof Sidebar> & { items: ContentItem[] }) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recall</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <TreeItem key={item.path} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function TreeItem({ item }: { item: ContentItem }) {
  const pathname = usePathname();
  const isActive =
    pathname === `/${item.path}` || pathname.startsWith(`/${item.path}/`);

  if (item.type === "folder" && item.children && item.children.length > 0) {
    return (
      <Collapsible
        key={item.path}
        defaultOpen={isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title} isActive={isActive}>
              <Folder className="h-4 w-4" />
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((subItem) => (
                <TreeItem key={subItem.path} item={subItem} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem key={item.path}>
      <SidebarMenuButton
        asChild
        isActive={pathname === `/${item.path.replace(/\.md$/, "")}`}
      >
        <Link href={`/${item.path.replace(/\.md$/, "")}`}>
          <FileText className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
