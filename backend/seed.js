const demoPassword = "DemoUser2026!";
const apiBaseUrl = (process.env.API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

const profiles = [
    ["Avery", "Morgan", "female", 27, ["JavaScript", "React", "Node.js"]],
    ["Liam", "Bennett", "male", 30, ["TypeScript", "React", "GraphQL"]],
    ["Maya", "Patel", "female", 25, ["Python", "Django", "PostgreSQL"]],
    ["Noah", "Carter", "male", 32, ["Go", "Docker", "Kubernetes"]],
    ["Sofia", "Reed", "female", 28, ["Java", "Spring", "AWS"]],
    ["Ethan", "Brooks", "male", 26, ["C++", "Linux", "Embedded"]],
    ["Zoey", "Foster", "female", 31, ["Ruby", "Rails", "Redis"]],
    ["Owen", "Price", "male", 29, ["C#", ".NET", "Azure"]],
    ["Iris", "Hayes", "female", 24, ["Swift", "iOS", "Firebase"]],
    ["Lucas", "Ward", "male", 34, ["PHP", "Laravel", "MySQL"]],
    ["Nina", "Coleman", "female", 27, ["Kotlin", "Android", "Jetpack"]],
    ["Jack", "Ramirez", "male", 33, ["Rust", "WebAssembly", "Linux"]],
    ["Ella", "Jenkins", "female", 26, ["Vue.js", "JavaScript", "CSS"]],
    ["Aria", "Sanders", "female", 29, ["Figma", "React", "Accessibility"]],
    ["Milo", "Peterson", "male", 28, ["Elixir", "Phoenix", "PostgreSQL"]],
    ["Leah", "Richardson", "female", 35, ["Data Science", "Python", "SQL"]],
    ["Ryan", "Cooper", "male", 24, ["Next.js", "TypeScript", "Tailwind"]],
    ["Tara", "Phillips", "female", 32, ["Machine Learning", "Python", "PyTorch"]],
    ["Kian", "Mitchell", "others", 27, ["Svelte", "JavaScript", "Node.js"]],
    ["Emma", "Campbell", "female", 30, ["DevOps", "Terraform", "AWS"]],
    ["Alex", "Parker", "others", 25, ["Unity", "C#", "Blender"]],
    ["Jude", "Edwards", "male", 31, ["HTML", "CSS", "JavaScript"]],
    ["Mina", "Stewart", "female", 28, ["Data Engineering", "Spark", "Scala"]],
    ["Theo", "Morris", "male", 26, ["Dart", "Flutter", "Firebase"]],
];

const connectionSeeds = [
    [0, 1, "interested"],
    [2, 3, "interested"],
    [4, 5, "accepted"],
    [6, 7, "ignored"],
    [8, 9, "interested"],
    [10, 11, "accepted"],
];

async function apiRequest(path, { cookie, ...options } = {}) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...(cookie ? { Cookie: cookie } : {}),
            ...options.headers,
        },
    });
    const body = await response.text();
    if (!response.ok) {
        throw new Error(`${options.method || "GET"} ${path} failed (${response.status}): ${body}`);
    }

    try {
        return body ? JSON.parse(body) : null;
    } catch {
        return body;
    }
}

async function login(emailId) {
    const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId, password: demoPassword }),
    });
    const body = await response.text();
    if (!response.ok) {
        throw new Error(`POST /login for ${emailId} failed (${response.status}): ${body}`);
    }

    const setCookie = response.headers.getSetCookie?.()[0] || response.headers.get("set-cookie");
    const cookie = setCookie?.split(";")[0];
    if (!cookie) {
        throw new Error(`POST /login for ${emailId} did not return an auth cookie.`);
    }
    return cookie;
}

async function createProfile(profile, index) {
    const [firstName, lastName, gender, age, skills] = profile;
    const emailId = `demo.user.${String(index + 1).padStart(2, "0")}@example.com`;

    try {
        await apiRequest("/signup", {
            method: "POST",
            body: JSON.stringify({ firstName, lastName, emailId, password: demoPassword }),
        });
    } catch (error) {
        if (!error.message.includes("(400)") || !error.message.toLowerCase().includes("duplicate")) {
            throw error;
        }
    }

    const cookie = await login(emailId);
    const profileData = await apiRequest("/profile/view", { cookie });
    if (!profileData?._id) {
        throw new Error(`GET /profile/view did not return an account ID for ${emailId}.`);
    }
    await apiRequest("/profile/edit", {
        method: "PATCH",
        cookie,
        body: JSON.stringify({
            age,
            gender,
            photoUrl: `https://example.com/avatars/dev-${String(index + 1).padStart(2, "0")}.png`,
            about: `Building useful software and connecting with other developers. Currently exploring ${skills[0]}.`,
            skills,
        }),
    });
    return { emailId, id: profileData._id, cookie };
}

async function seed() {
    const accounts = [];
    for (const [index, profile] of profiles.entries()) {
        accounts.push(await createProfile(profile, index));
    }

    let createdRequests = 0;
    for (const [fromIndex, toIndex, finalStatus] of connectionSeeds) {
        const fromAccount = accounts[fromIndex];
        const toAccount = accounts[toIndex];
        const status = finalStatus === "ignored" ? "ignored" : "interested";
        let response;
        try {
            response = await apiRequest(`/request/send/${status}/${toAccount.id}`, {
                method: "POST",
                cookie: fromAccount.cookie,
            });
        } catch (error) {
            if (error.message.includes("(404)") && error.message.includes("Request already exists")) {
                continue;
            }
            throw error;
        }

        if (finalStatus === "accepted") {
            const requestId = response?.data?._id;
            if (!requestId) {
                throw new Error(`POST /request/send did not return a request ID for ${fromAccount.emailId}.`);
            }
            await apiRequest(`/request/review/accepted/${requestId}`, {
                method: "POST",
                cookie: toAccount.cookie,
            });
        }
        createdRequests += 1;
    }

    console.log(`Created or validated ${accounts.length} demo accounts through signup and profile APIs.`);
    console.log(`Created ${createdRequests} connection requests through send/review APIs involving 12 accounts.`);
    console.log(`Demo login password: ${demoPassword}`);
}

seed().catch((error) => {
    console.error("API seeding failed:", error.message);
    process.exitCode = 1;
});
