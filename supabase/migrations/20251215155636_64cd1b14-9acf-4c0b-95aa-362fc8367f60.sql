-- Update handle_new_user function with input validation for display_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  validated_display_name TEXT;
BEGIN
  -- Validate and sanitize display_name: limit to 100 chars, trim whitespace
  validated_display_name := NULLIF(TRIM(LEFT(new.raw_user_meta_data ->> 'display_name', 100)), '');
  
  -- Insert with validated data, handle potential duplicates gracefully
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, validated_display_name)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;