export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      admin_allowlist: {
        Row: {
          email: string;
        };
        Insert: {
          email: string;
        };
        Update: {
          email?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          budget: string;
          company_email: string;
          company_name: string;
          created_at: string;
          delivery_time: string;
          email_sent: boolean;
          full_name: string;
          id: string;
          message: string;
          phone: string | null;
          project_type: string;
          slot_end: string;
          slot_start: string;
          status: string;
          visitor_timezone: string;
        };
        Insert: {
          budget: string;
          company_email: string;
          company_name: string;
          created_at?: string;
          delivery_time: string;
          email_sent?: boolean;
          full_name: string;
          id?: string;
          message: string;
          phone?: string | null;
          project_type: string;
          slot_end: string;
          slot_start: string;
          status?: string;
          visitor_timezone: string;
        };
        Update: {
          budget?: string;
          company_email?: string;
          company_name?: string;
          created_at?: string;
          delivery_time?: string;
          email_sent?: boolean;
          full_name?: string;
          id?: string;
          message?: string;
          phone?: string | null;
          project_type?: string;
          slot_end?: string;
          slot_start?: string;
          status?: string;
          visitor_timezone?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          business_name: string | null;
          created_at: string;
          email: string;
          id: string;
          name: string;
          user_id: string | null;
        };
        Insert: {
          business_name?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          name: string;
          user_id?: string | null;
        };
        Update: {
          business_name?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          business_name: string | null;
          created_at: string;
          email: string;
          email_sent: boolean;
          id: string;
          message: string;
          name: string;
          plan: Database["public"]["Enums"]["contact_plan"];
          source_page: string | null;
          status: Database["public"]["Enums"]["contact_status"];
        };
        Insert: {
          business_name?: string | null;
          created_at?: string;
          email: string;
          email_sent?: boolean;
          id?: string;
          message: string;
          name: string;
          plan?: Database["public"]["Enums"]["contact_plan"];
          source_page?: string | null;
          status?: Database["public"]["Enums"]["contact_status"];
        };
        Update: {
          business_name?: string | null;
          created_at?: string;
          email?: string;
          email_sent?: boolean;
          id?: string;
          message?: string;
          name?: string;
          plan?: Database["public"]["Enums"]["contact_plan"];
          source_page?: string | null;
          status?: Database["public"]["Enums"]["contact_status"];
        };
        Relationships: [];
      };
      contact_rate_limits: {
        Row: {
          created_at: string;
          id: string;
          ip_hash: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          ip_hash: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          ip_hash?: string;
        };
        Relationships: [];
      };
      deliverables: {
        Row: {
          created_at: string;
          external_url: string | null;
          file_path: string | null;
          id: string;
          project_id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          external_url?: string | null;
          file_path?: string | null;
          id?: string;
          project_id: string;
          title: string;
        };
        Update: {
          created_at?: string;
          external_url?: string | null;
          file_path?: string | null;
          id?: string;
          project_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "deliverables_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice_items: {
        Row: {
          description: string;
          id: string;
          invoice_id: string;
          quantity: number;
          unit_price: number;
        };
        Insert: {
          description: string;
          id?: string;
          invoice_id: string;
          quantity?: number;
          unit_price?: number;
        };
        Update: {
          description?: string;
          id?: string;
          invoice_id?: string;
          quantity?: number;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
          client_id: string;
          created_at: string;
          currency: string;
          due_date: string | null;
          id: string;
          issue_date: string;
          notes: string | null;
          number: string | null;
          project_id: string | null;
          status: Database["public"]["Enums"]["invoice_status"];
        };
        Insert: {
          client_id: string;
          created_at?: string;
          currency?: string;
          due_date?: string | null;
          id?: string;
          issue_date?: string;
          notes?: string | null;
          number?: string | null;
          project_id?: string | null;
          status?: Database["public"]["Enums"]["invoice_status"];
        };
        Update: {
          client_id?: string;
          created_at?: string;
          currency?: string;
          due_date?: string | null;
          id?: string;
          issue_date?: string;
          notes?: string | null;
          number?: string | null;
          project_id?: string | null;
          status?: Database["public"]["Enums"]["invoice_status"];
        };
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      milestones: {
        Row: {
          due_date: string | null;
          id: string;
          project_id: string;
          sort_order: number;
          status: Database["public"]["Enums"]["milestone_status"];
          title: string;
        };
        Insert: {
          due_date?: string | null;
          id?: string;
          project_id: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["milestone_status"];
          title: string;
        };
        Update: {
          due_date?: string | null;
          id?: string;
          project_id?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["milestone_status"];
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          confirmed_at: string | null;
          confirmed_by: string | null;
          id: string;
          invoice_id: string;
          method: Database["public"]["Enums"]["payment_method"];
          reference: string | null;
          reported_at: string | null;
        };
        Insert: {
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          id?: string;
          invoice_id: string;
          method: Database["public"]["Enums"]["payment_method"];
          reference?: string | null;
          reported_at?: string | null;
        };
        Update: {
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          id?: string;
          invoice_id?: string;
          method?: Database["public"]["Enums"]["payment_method"];
          reference?: string | null;
          reported_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          client_id: string;
          created_at: string;
          id: string;
          name: string;
          progress: number;
          start_date: string | null;
          status: Database["public"]["Enums"]["project_status"];
          summary: string | null;
          target_date: string | null;
        };
        Insert: {
          client_id: string;
          created_at?: string;
          id?: string;
          name: string;
          progress?: number;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["project_status"];
          summary?: string | null;
          target_date?: string | null;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
          progress?: number;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["project_status"];
          summary?: string | null;
          target_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      claim_portal_access: { Args: never; Returns: undefined };
      consume_contact_rate_limit: { Args: { hash: string }; Returns: boolean };
      current_client_id: { Args: never; Returns: string };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      invoice_client_id: { Args: { _invoice: string }; Returns: string };
      is_admin: { Args: never; Returns: boolean };
      link_user_by_email: {
        Args: { _email: string; _user_id: string };
        Returns: undefined;
      };
      project_client_id: { Args: { _project: string }; Returns: string };
      taken_booking_slots: {
        Args: { range_end: string; range_start: string };
        Returns: {
          slot_start: string;
        }[];
      };
    };
    Enums: {
      app_role: "admin" | "client";
      contact_plan: "starter" | "growth" | "scale" | "not_sure";
      contact_status: "new" | "read" | "archived";
      invoice_status: "draft" | "sent" | "pending_confirmation" | "paid" | "overdue";
      milestone_status: "todo" | "in_progress" | "done";
      payment_method: "payoneer" | "wise" | "paypal" | "bank_transfer";
      project_status: "planning" | "in_progress" | "review" | "live" | "on_hold";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "client"],
      contact_plan: ["starter", "growth", "scale", "not_sure"],
      contact_status: ["new", "read", "archived"],
      invoice_status: ["draft", "sent", "pending_confirmation", "paid", "overdue"],
      milestone_status: ["todo", "in_progress", "done"],
      payment_method: ["payoneer", "wise", "paypal", "bank_transfer"],
      project_status: ["planning", "in_progress", "review", "live", "on_hold"],
    },
  },
} as const;
