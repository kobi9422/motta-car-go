export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string
          created_at: string
          brand: string
          model: string
          year: number
          category: string
          price_per_day: number
          seats: number
          transmission: string
          fuel_type: string
          image_url: string
          available: boolean
          features: string[]
          description: string
        }
        Insert: {
          id?: string
          created_at?: string
          brand: string
          model: string
          year: number
          category: string
          price_per_day: number
          seats: number
          transmission: string
          fuel_type: string
          image_url: string
          available?: boolean
          features?: string[]
          description: string
        }
        Update: {
          id?: string
          created_at?: string
          brand?: string
          model?: string
          year?: number
          category?: string
          price_per_day?: number
          seats?: number
          transmission?: string
          fuel_type?: string
          image_url?: string
          available?: boolean
          features?: string[]
          description?: string
        }
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          user_id: string
          car_id: string
          start_date: string
          end_date: string
          pickup_location: string
          dropoff_location: string
          total_price: number
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'refunded'
          payment_intent_id: string | null
          contract_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          car_id: string
          start_date: string
          end_date: string
          pickup_location: string
          dropoff_location: string
          total_price: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'refunded'
          payment_intent_id?: string | null
          contract_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          car_id?: string
          start_date?: string
          end_date?: string
          pickup_location?: string
          dropoff_location?: string
          total_price?: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'refunded'
          payment_intent_id?: string | null
          contract_url?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          created_at: string
          user_id: string
          booking_id: string | null
          document_type: 'license' | 'id_card' | 'other'
          file_url: string
          file_name: string
          verified: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          booking_id?: string | null
          document_type: 'license' | 'id_card' | 'other'
          file_url: string
          file_name: string
          verified?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          booking_id?: string | null
          document_type?: 'license' | 'id_card' | 'other'
          file_url?: string
          file_name?: string
          verified?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string
          phone: string | null
          date_of_birth: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string | null
          role: 'user' | 'admin'
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name: string
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          role?: 'user' | 'admin'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          role?: 'user' | 'admin'
        }
      }
      cars_for_sale: {
        Row: {
          id: string
          created_at: string
          brand: string
          model: string
          year: number
          category: string
          price: number
          mileage: number
          seats: number
          transmission: string
          fuel_type: string
          image_url: string
          available: boolean
          features: string[]
          description: string
          condition: 'Nuova' | 'Usata' | 'Km 0'
          previous_owners: number
          registration_date: string | null
          last_service_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          brand: string
          model: string
          year: number
          category: string
          price: number
          mileage: number
          seats: number
          transmission: string
          fuel_type: string
          image_url: string
          available?: boolean
          features?: string[]
          description: string
          condition?: 'Nuova' | 'Usata' | 'Km 0'
          previous_owners?: number
          registration_date?: string | null
          last_service_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          brand?: string
          model?: string
          year?: number
          category?: string
          price?: number
          mileage?: number
          seats?: number
          transmission?: string
          fuel_type?: string
          image_url?: string
          available?: boolean
          features?: string[]
          description?: string
          condition?: 'Nuova' | 'Usata' | 'Km 0'
          previous_owners?: number
          registration_date?: string | null
          last_service_date?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

