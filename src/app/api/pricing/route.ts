import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const getLocalPricing = () => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'pricing.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error("Failed to read local pricing.json:", err);
    return {
      "quick": { "id": "quick", "title": "Quick Chat Consultation", "price": "₹199" },
      "bronze": { "id": "bronze", "title": "Bronze Consultation (15 Mins)", "price": "₹399" },
      "silver": { "id": "silver", "title": "Silver Consultation (30 Mins)", "price": "₹599" },
      "gold": { "id": "gold", "title": "Gold Deep Analysis (60 Mins)", "price": "₹799" },
      "marriage": { "id": "marriage", "title": "Marriage Matching", "price": "₹499" },
      "muhurtham": { "id": "muhurtham", "title": "Muhurtham & Auspicious Timing", "price": "₹499" }
    };
  }
};

const saveLocalPricing = (data: any) => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'pricing.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Failed to save local pricing.json:", err);
    return false;
  }
};

export async function GET() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*');

      if (!error && data && data.length > 0) {
        // Map list of plan objects to the record structure
        const pricingMap: any = {};
        data.forEach((plan: any) => {
          pricingMap[plan.id] = {
            id: plan.id,
            title: plan.title,
            price: plan.price
          };
        });
        return NextResponse.json(pricingMap);
      } else if (data && data.length === 0) {
        // Seed Supabase database with local prices if table is empty
        const localData = getLocalPricing();
        const insertRows = Object.values(localData).map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price
        }));

        await supabase.from('pricing_plans').insert(insertRows);
        return NextResponse.json(localData);
      }
    } catch (err) {
      console.warn("Supabase pricing fetch failed, returning local file:", err);
    }
  }

  // Fallback to local files
  return NextResponse.json(getLocalPricing());
}

export async function POST(request: Request) {
  try {
    const newPricing = await request.json();
    
    // Write locally first
    saveLocalPricing(newPricing);

    // Sync to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const upsertRows = Object.values(newPricing).map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
          .from('pricing_plans')
          .upsert(upsertRows);

        if (error) {
          console.error("Supabase pricing upsert error:", error);
        }
      } catch (err) {
        console.error("Failed to sync updated pricing to Supabase:", err);
      }
    }

    return NextResponse.json({ success: true, pricing: newPricing });
  } catch (err: any) {
    console.error("Pricing update API failure:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
