-- =====================================================
-- SUPABASE SCHEMA: IELTS Essay Submissions Table
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to create
-- the submissions table for storing essay assessments.
-- =====================================================

-- Create the submissions table
CREATE TABLE IF NOT EXISTS submissions (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User Reference (links to your users table)
    user_id TEXT NOT NULL,
    
    -- Essay Data
    question TEXT NOT NULL,
    essay TEXT NOT NULL,
    
    -- Overall Score
    overall_band DECIMAL(2,1) NOT NULL CHECK (overall_band >= 0 AND overall_band <= 9),
    
    -- Task Response Criterion
    task_response_score DECIMAL(2,1) NOT NULL CHECK (task_response_score >= 0 AND task_response_score <= 9),
    task_response_feedback TEXT NOT NULL,
    
    -- Coherence & Cohesion Criterion
    coherence_cohesion_score DECIMAL(2,1) NOT NULL CHECK (coherence_cohesion_score >= 0 AND coherence_cohesion_score <= 9),
    coherence_cohesion_feedback TEXT NOT NULL,
    
    -- Lexical Resource Criterion
    lexical_resource_score DECIMAL(2,1) NOT NULL CHECK (lexical_resource_score >= 0 AND lexical_resource_score <= 9),
    lexical_resource_feedback TEXT NOT NULL,
    
    -- Grammatical Range & Accuracy Criterion
    grammatical_range_score DECIMAL(2,1) NOT NULL CHECK (grammatical_range_score >= 0 AND grammatical_range_score <= 9),
    grammatical_range_feedback TEXT NOT NULL,
    
    -- Corrections Array (stored as JSONB for flexibility)
    -- Structure: [{ "original_sentence": "", "corrected_sentence": "", "explanation": "" }]
    corrections JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Model Essay Comparison
    model_essay_comparison TEXT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Index on user_id for fast user-specific queries
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);

-- Index on created_at for sorting by date
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- Composite index for user + date queries
CREATE INDEX IF NOT EXISTS idx_submissions_user_date ON submissions(user_id, created_at DESC);

-- Index on overall_band for analytics queries
CREATE INDEX IF NOT EXISTS idx_submissions_overall_band ON submissions(overall_band);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on the table
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own submissions
CREATE POLICY "Users can view own submissions" ON submissions
    FOR SELECT
    USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own submissions
CREATE POLICY "Users can insert own submissions" ON submissions
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own submissions
CREATE POLICY "Users can update own submissions" ON submissions
    FOR UPDATE
    USING (auth.uid()::text = user_id);

-- Policy: Users can delete their own submissions
CREATE POLICY "Users can delete own submissions" ON submissions
    FOR DELETE
    USING (auth.uid()::text = user_id);

-- =====================================================
-- TRIGGER: Auto-update updated_at timestamp
-- =====================================================

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on update
DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- EXAMPLE QUERIES
-- =====================================================

-- Get all submissions for a user (most recent first):
-- SELECT * FROM submissions WHERE user_id = 'user-id-here' ORDER BY created_at DESC;

-- Get average band score for a user:
-- SELECT AVG(overall_band) as avg_band FROM submissions WHERE user_id = 'user-id-here';

-- Get submission count by band score (analytics):
-- SELECT overall_band, COUNT(*) as count FROM submissions GROUP BY overall_band ORDER BY overall_band;

-- Get recent submissions with criteria breakdown:
-- SELECT 
--     id, 
--     created_at,
--     overall_band,
--     task_response_score,
--     coherence_cohesion_score,
--     lexical_resource_score,
--     grammatical_range_score
-- FROM submissions 
-- WHERE user_id = 'user-id-here'
-- ORDER BY created_at DESC
-- LIMIT 10;
