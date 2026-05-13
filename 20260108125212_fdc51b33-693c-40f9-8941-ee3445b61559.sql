-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'warden', 'admin');

-- Create enum for hostel types
CREATE TYPE public.hostel_type AS ENUM ('hostel-a', 'hostel-b', 'hostel-c', 'hostel-d', 'pg-block');

-- Create enum for year of study
CREATE TYPE public.year_of_study AS ENUM ('1', '2', '3', '4', 'pg');

-- Create profiles table for all users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  hostel hostel_type,
  year year_of_study,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create questionnaire_responses table
CREATE TABLE public.questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  responses JSONB NOT NULL DEFAULT '{}',
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compatibility_scores table (computed from responses)
CREATE TABLE public.compatibility_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  sleep_score INTEGER NOT NULL DEFAULT 0 CHECK (sleep_score >= 0 AND sleep_score <= 100),
  study_score INTEGER NOT NULL DEFAULT 0 CHECK (study_score >= 0 AND study_score <= 100),
  cleanliness_score INTEGER NOT NULL DEFAULT 0 CHECK (cleanliness_score >= 0 AND cleanliness_score <= 100),
  social_score INTEGER NOT NULL DEFAULT 0 CHECK (social_score >= 0 AND social_score <= 100),
  lifestyle_score INTEGER NOT NULL DEFAULT 0 CHECK (lifestyle_score >= 0 AND lifestyle_score <= 100),
  conflict_score INTEGER NOT NULL DEFAULT 0 CHECK (conflict_score >= 0 AND conflict_score <= 100),
  overall_score INTEGER NOT NULL DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  risk_flags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create room_allocations table
CREATE TABLE public.room_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL,
  hostel hostel_type NOT NULL,
  room_type INTEGER NOT NULL DEFAULT 2 CHECK (room_type IN (2, 3, 4)),
  assigned_students UUID[] NOT NULL DEFAULT '{}',
  compatibility_score INTEGER,
  locked BOOLEAN NOT NULL DEFAULT false,
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compatibility_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_allocations ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is admin or warden
CREATE OR REPLACE FUNCTION public.is_admin_or_warden(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'warden')
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and wardens can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin_or_warden(auth.uid()));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for questionnaire_responses
CREATE POLICY "Users can view their own responses"
  ON public.questionnaire_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses"
  ON public.questionnaire_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses"
  ON public.questionnaire_responses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and wardens can view all responses"
  ON public.questionnaire_responses FOR SELECT
  USING (public.is_admin_or_warden(auth.uid()));

-- RLS Policies for compatibility_scores
CREATE POLICY "Users can view their own scores"
  ON public.compatibility_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores"
  ON public.compatibility_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scores"
  ON public.compatibility_scores FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and wardens can view all scores"
  ON public.compatibility_scores FOR SELECT
  USING (public.is_admin_or_warden(auth.uid()));

CREATE POLICY "Admins and wardens can manage all scores"
  ON public.compatibility_scores FOR ALL
  USING (public.is_admin_or_warden(auth.uid()));

-- RLS Policies for room_allocations
CREATE POLICY "Students can view their room allocation"
  ON public.room_allocations FOR SELECT
  USING (auth.uid() = ANY(assigned_students));

CREATE POLICY "Admins and wardens can manage room allocations"
  ON public.room_allocations FOR ALL
  USING (public.is_admin_or_warden(auth.uid()));

-- Create trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  -- Default role is student
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_questionnaire_responses_updated_at
  BEFORE UPDATE ON public.questionnaire_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compatibility_scores_updated_at
  BEFORE UPDATE ON public.compatibility_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_room_allocations_updated_at
  BEFORE UPDATE ON public.room_allocations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();