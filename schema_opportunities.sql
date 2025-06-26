-- Création de la table des opportunités
CREATE TABLE opportunities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    source VARCHAR(50) NOT NULL,
    keyword TEXT NOT NULL,
    volume INTEGER NOT NULL DEFAULT 0,
    sentiment DECIMAL(4,3) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    potential_reach INTEGER NOT NULL DEFAULT 0,
    engagement_rate DECIMAL(5,4) NOT NULL DEFAULT 0,
    relevance_score DECIMAL(4,3) NOT NULL DEFAULT 0,
    growth_rate DECIMAL(5,4),
    duration INTEGER,
    category VARCHAR(100),
    related_keywords TEXT[],
    demographic_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX idx_opportunities_type ON opportunities(type);
CREATE INDEX idx_opportunities_source ON opportunities(source);
CREATE INDEX idx_opportunities_timestamp ON opportunities(timestamp);
CREATE INDEX idx_opportunities_relevance ON opportunities(relevance_score DESC);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Vue pour les opportunités les plus pertinentes
CREATE VIEW relevant_opportunities AS
SELECT *
FROM opportunities
WHERE relevance_score >= 0.7
  AND timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY relevance_score DESC;

-- Fonction pour obtenir les tendances similaires
CREATE OR REPLACE FUNCTION get_similar_trends(trend_id UUID)
RETURNS TABLE (
    id UUID,
    keyword TEXT,
    similarity DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.keyword,
        similarity(
            (SELECT keyword FROM opportunities WHERE id = trend_id),
            o.keyword
        ) as similarity
    FROM opportunities o
    WHERE o.id != trend_id
    AND o.timestamp >= NOW() - INTERVAL '7 days'
    ORDER BY similarity DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql; 