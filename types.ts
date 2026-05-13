export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      compatibility_scores: {
        Row: {
          cleanliness_score: number
          conflict_score: number
          created_at: string
          id: string
          lifestyle_score: number
          overall_score: number
          risk_flags: string[]
          sleep_score: number
          social_score: number
          study_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cleanliness_score?: number
          conflict_score?: number
          created_at?: string
          id?: string
          lifestyle_score?: number
          overall_score?: number
          risk_flags?: string[]
          sleep_score?: number
          social_score?: number
          study_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cleanliness_score?: number
          conflict_score?: number
          created_at?: string
          id?: string
          lifestyle_score?: number
          overall_score?: number
          risk_flags?: string[]
          sleep_score?: number
          social_score?: number
          study_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          hostel: Database["public"]["Enums"]["hostel_type"] | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
          year: Database["public"]["Enums"]["year_of_study"] | null
        }
        Insert: {
          created_at?: string
          full_name: string
          hostel?: Database["public"]["Enums"]["hostel_type"] | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
          year?: Database["public"]["Enums"]["year_of_study"] | null
        }
        Update: {
          created_at?: string
          full_name?: string
          hostel?: Database["public"]["Enums"]["hostel_type"] | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          year?: Database["public"]["Enums"]["year_of_study"] | null
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          responses: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          responses?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          responses?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      room_allocations: {
        Row: {
          assigned_by: string | null
          assigned_students: string[]
          compatibility_score: number | null
          created_at: string
          hostel: Database["public"]["Enums"]["hostel_type"]
          id: string
          locked: boolean
          room_number: string
          room_type: number
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          assigned_students?: string[]
          compatibility_score?: number | null
          created_at?: string
          hostel: Database["public"]["Enums"]["hostel_type"]
          id?: string
          locked?: boolean
          room_number: string
          room_type?: number
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          assigned_students?: string[]
          compatibility_score?: number | null
          created_at?: string
          hostel?: Database["public"]["Enums"]["hostel_type"]
          id?: string
          locked?: boolean
          room_number?: string
          room_type?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_warden: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "student" | "warden" | "admin"
      hostel_type:
        | "hostel-a"
        | "hostel-b"
        | "hostel-c"
        | "hostel-d"
        | "pg-block"
      year_of_study: "1" | "2" | "3" | "4" | "pg"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "warden", "admin"],
      hostel_type: ["hostel-a", "hostel-b", "hostel-c", "hostel-d", "pg-block"],
      year_of_study: ["1", "2", "3", "4", "pg"],
    },
  },
} as const
