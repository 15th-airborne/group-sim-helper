use std::collections::HashMap;

const LIMIT: u32 = 100003;
const LOOKUP_LIMIT: u32 = 40000; // LIMIT * LOOKUP_LIMIT is already close to the limit of u32. enough for linear approximation

fn main() {
    let mut lookup_table: HashMap<u32, (u32, u32)> = HashMap::new();
    let mut e_cache: HashMap<u32, f64> = HashMap::new();
    let mut p_cache: HashMap<u32, f64> = HashMap::new();

    for g in (0..=LOOKUP_LIMIT).step_by(200) {
        for p in (0..=LOOKUP_LIMIT).step_by(200) {
            lookup_table.insert(g * LIMIT + p, (
                (calc_e(g, p, &mut e_cache) * 100.).floor() as u32,
                (calc_p(g, p, &mut p_cache) * 100. * 100.).floor() as u32
            ));
        }
    }

    print!("{}", serde_json::to_string(&lookup_table).unwrap())
}

fn calc_e(g: u32, p: u32, cache: &mut HashMap<u32, f64>) -> f64 {
    if g < 100 {
        return g as f64
    }

    if !cache.contains_key(&(g * LIMIT + p)) {
        let v = 0.01 * (g + p - 20) as f64 +
                0.1 * calc_e(g - 100 + (0.05 * (p + 80) as f64).floor() as u32, p + 80 - (0.05 * (p + 80) as f64).floor() as u32, cache) +
                0.49 * calc_e(g - 100 + (0.01 * (p + 80) as f64).floor() as u32, p + 80 - (0.01 * (p + 80) as f64).floor() as u32, cache) +
                0.4 * calc_e(g - 100, p + 80, cache);
        cache.insert(g * LIMIT + p, v);
    }

    cache[&(g * LIMIT + p)]
}

fn calc_p(g: u32, p: u32, cache: &mut HashMap<u32, f64>) -> f64 {
    if g < 100 {
        return 0.
    }

    if !cache.contains_key(&(g * LIMIT + p)) {
        let v = 0.01 +
                0.1 * calc_p(g - 100 + (0.05 * (p + 80) as f64).floor() as u32, p + 80 - (0.05 * (p + 80) as f64).floor() as u32, cache) +
                0.49 * calc_p(g - 100 + (0.01 * (p + 80) as f64).floor() as u32, p + 80 - (0.01 * (p + 80) as f64).floor() as u32, cache) +
                0.4 * calc_p(g - 100, p + 80, cache);
        cache.insert(g * LIMIT + p, v);
    }

    cache[&(g * LIMIT + p)]
}
