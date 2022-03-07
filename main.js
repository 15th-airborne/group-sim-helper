const limit = 100003

function gacha_calculator(g, p, z, a, w, cache={}) {
    if (p >= limit)
        throw "too big"

    if (g < 100)
        return g + z

    const key = g * limit + p

    if (cache[key])
        return z + cache[key]

    result = 0.01 * a * gacha_calculator(g + p - 20, 0, z, a, w, cache) +
             0.01 * (1 - a) * (g + p - 20 + z) +
             0.1 * gacha_calculator(g - 100 + Math.floor(0.05 * (p + 80)), p + 80 - Math.floor(0.05 * (p + 80)), z, a, w, cache) +
             0.49 * gacha_calculator(g - 100 + Math.floor(0.01 * (p + 80)), p + 80 - Math.floor(0.01 * (p + 80)), z, a, w, cache) +
             0.1 * gacha_calculator(g - 100, p + 80, z + 2 * w.q5_gun, a, w, cache) +
             0.1 * gacha_calculator(g - 100, p + 80, z + 2 * w.q5_bread, a, w, cache) +
             0.1 * gacha_calculator(g - 100, p + 80, z + 2 * w.q1_gun, a, w, cache) +
             0.1 * gacha_calculator(g - 100, p + 80, z + 2 * w.q1_bread, a, w, cache)

    cache[key] = result - z

    return result
}

function gacha_calc_p(g, p, cache={}) {
    if (p >= limit)
        throw "too big"

    if (g < 100)
        return 0

    const key = g * limit + p

    if (cache[key])
        return cache[key]

    result = 0.01 +
             0.1 * gacha_calc_p(g - 100 + Math.floor(0.05 * (p + 80)), p + 80 - Math.floor(0.05 * (p + 80)), cache) +
             0.49 * gacha_calc_p(g - 100 + Math.floor(0.01 * (p + 80)), p + 80 - Math.floor(0.01 * (p + 80)), cache) +
             0.4 * gacha_calc_p(g - 100, p + 80, cache)

    cache[key] = result

    return result
}

function lookup(g, p) {
    const lookup_limit = 40000

    if (p >= limit || g >= lookup_limit || p >= lookup_limit)
        return [g + p - 2000, 1]

    const g_lower = Math.floor(g / 200) * 200
    const g_upper = Math.floor(g / 200 + 1) * 200
    const p_lower = Math.floor(p / 200) * 200
    const p_upper = Math.floor(p / 200 + 1) * 200
    const m_g = (g % 200) / 200
    const m_p = (p % 200) / 200

    const looked_e = (1 - m_g) * (1 - m_p) * lookup_table[g_lower * limit + p_lower][0] +
                           m_g * (1 - m_p) * lookup_table[g_upper * limit + p_lower][0] +
                     (1 - m_g) *       m_p * lookup_table[g_lower * limit + p_upper][0] +
                           m_g *       m_p * lookup_table[g_upper * limit + p_upper][0]

    const looked_p = (1 - m_g) * (1 - m_p) * lookup_table[g_lower * limit + p_lower][1] +
                           m_g * (1 - m_p) * lookup_table[g_upper * limit + p_lower][1] +
                     (1 - m_g) *       m_p * lookup_table[g_lower * limit + p_upper][1] +
                           m_g *       m_p * lookup_table[g_upper * limit + p_upper][1]

    return [looked_e / 100, looked_p / 100 / 100]
}

function gacha_handler() {
    const approx = document.querySelector("#approx").checked

    let a = 0
    if (document.querySelector("#gacha-a").checked)
        a = 1

    let w = { q5_gun: 0, q5_bread: 0, q1_gun: 0, q1_bread: 0 }
    if (document.querySelector("#gacha-w-gun").checked)
        w = { ...w, q5_gun: 50, q1_gun: 5 }
    if (document.querySelector("#gacha-w-bread").checked)
        w = { ...w, q5_bread: 50, q1_bread: 5 }

    const g = parseInt(document.querySelector("#gacha-g").value)
    const p = parseInt(document.querySelector("#gacha-p").value)

    const e = approx ? lookup(g, p)[0] : gacha_calculator(g, p, 0, a, w)

    document.querySelector("#gacha-result-a").textContent = a
    document.querySelector("#gacha-result-w-q5-gun").textContent = w.q5_gun
    document.querySelector("#gacha-result-w-q5-bread").textContent = w.q5_bread
    document.querySelector("#gacha-result-w-q1-gun").textContent = w.q1_gun
    document.querySelector("#gacha-result-w-q1-bread").textContent = w.q1_bread
    document.querySelector("#gacha-result-e").textContent = e
    document.querySelector("#gacha-result-r").textContent = e - g
    document.querySelector("#gacha-result-p").textContent = (approx ? lookup(g, p)[1] : gacha_calc_p(g, p)) * 100 + "%"
}

document.querySelector("#gacha-g").addEventListener("change", gacha_handler)
document.querySelector("#gacha-p").addEventListener("change", gacha_handler)

document.querySelector("#approx").addEventListener("change", () => {
    if (document.querySelector("#approx").checked) {
        document.querySelector("#gacha-a").checked = false
        document.querySelector("#gacha-w-gun").checked = false
        document.querySelector("#gacha-w-bread").checked = false
    }
    gacha_handler()
})

document.querySelector("#gacha-a").addEventListener("change", () => {
    if (document.querySelector("#gacha-a").checked)
        document.querySelector("#approx").checked = false
    gacha_handler()
})

document.querySelector("#gacha-w-gun").addEventListener("change", () => {
    if (document.querySelector("#gacha-w-gun").checked)
        document.querySelector("#approx").checked = false
    gacha_handler()
})

document.querySelector("#gacha-w-bread").addEventListener("change", () => {
    if (document.querySelector("#gacha-w-bread").checked)
        document.querySelector("#approx").checked = false
    gacha_handler()
})

gacha_handler()
