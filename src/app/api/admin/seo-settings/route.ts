import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const seoSettingsFile = path.join(dataDir, 'seo-settings.json');

const defaultSettings = {
  title: "Queen Bean",
  description: "A royal culinary experience.",
  keywords: "Queen Bean, brunch, coffee, fine dining, restaurant",
  ogImage: "/images/cover.png",
  jsonLd: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Restaurant\",\n  \"name\": \"Queen Bean\",\n  \"image\": \"/images/cover.png\",\n  \"@id\": \"\",\n  \"url\": \"https://queenbean.com\",\n  \"telephone\": \"+1234567890\",\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"streetAddress\": \"123 Queen St\",\n    \"addressLocality\": \"New York\",\n    \"addressRegion\": \"NY\",\n    \"postalCode\": \"10001\",\n    \"addressCountry\": \"US\"\n  },\n  \"menu\": \"https://queenbean.com/menu\",\n  \"servesCuisine\": [\"Brunch\", \"Coffee\", \"American\"],\n  \"priceRange\": \"$$\"\n}"
};

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(seoSettingsFile);
    } catch {
      await fs.writeFile(seoSettingsFile, JSON.stringify(defaultSettings, null, 2));
    }
  } catch (error) {
    console.error('Failed to ensure seo settings file:', error);
  }
}

export async function GET() {
  await ensureDataFile();
  try {
    const data = await fs.readFile(seoSettingsFile, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading seo settings:', error);
    return NextResponse.json(defaultSettings);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDataFile();
    const data = await request.json();
    
    // Merge with defaults to ensure all fields exist
    const newData = { ...defaultSettings, ...data };
    
    await fs.writeFile(seoSettingsFile, JSON.stringify(newData, null, 2));
    
    return NextResponse.json({ success: true, settings: newData });
  } catch (error) {
    console.error('Failed to save seo settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
