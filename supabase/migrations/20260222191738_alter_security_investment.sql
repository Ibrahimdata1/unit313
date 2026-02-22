ALTER TABLE investment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investment and Entrepreneur can view investments"
ON investment FOR SELECT
USING (auth.uid()=investor_id OR auth.uid() in (SELECT author_id FROM posts WHERE posts.id = investment.post_id));

CREATE POLICY "Investor can manage their own investment"
ON investment FOR ALL
USING (auth.uid()=investor_id)
WITH CHECK (auth.uid()=investor_id);