CREATE TABLE toilets_san_diego_ca (
	id SERIAL PRIMARY KEY,
	site VARCHAR(255),
	address VARCHAR(255),
	latitude DECIMAL(9,6),  -- Latitude (9 total digits, 6 after the decimal)
    longitude DECIMAL(9,6),  -- Longitude (9 total digits, 6 after the decimal)
	hours VARCHAR(100),
	cleaning_frequency VARCHAR(100),
	public BOOLEAN,
	content TEXT,
	images VARCHAR(255)[],  -- storing images as an array of url strings
	operated_by VARCHAR(100),
	author_id INTEGER REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);