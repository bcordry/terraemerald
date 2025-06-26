// news-data.js
// This file contains all news articles as an array of objects.
// Each object represents a single news article.
// To add new articles, simply add a new object to this array.

const newsArticles = [
    {
        // Unique identifier for this article - used for direct linking
        id: "2025-06-25-patch-1-2", 
        // Article title that appears in the header
        title: "Patch 1.2: Null Protocol Enhancements",
        // Publication date in YYYY-MM-DD format
        date: "2025-06-25",
        // Short summary that appears in previews and collapsed view
        summary: "Major improvements to Type: Null evolution mechanics and AI trainer behavior.",
        // Full article content - can include HTML tags for formatting
        content: `
            <h4>New Features:</h4>
            <ul>
                <li><strong>Enhanced Type: Null Evolution:</strong> Silvally now has improved type-shifting animations and effects</li>
                <li><strong>AI Improvements:</strong> Gym leaders now use more strategic switching patterns</li>
                <li><strong>New Encounters:</strong> Added rare Type: Null encounters in Victory Road</li>
            </ul>
            
            <h4>Bug Fixes:</h4>
            <ul>
                <li>Fixed crash when using Memory discs in battle</li>
                <li>Corrected Silvally's stat calculations with different memories</li>
                <li>Fixed visual glitch with synthetic Pokemon in PC boxes</li>
            </ul>
            
            <h4>Balance Changes:</h4>
            <ul>
                <li>Slightly reduced Elite Four team levels (58-62 → 56-60)</li>
                <li>Buffed several underused synthetic Pokemon</li>
                <li>Adjusted encounter rates in late-game areas</li>
            </ul>
            
            <p><em>Download the latest patch from our <a href="patch-applier.html">Patch Applier</a> page!</em></p>
        `
    },
    {
        id: "2025-06-20-community-spotlight",
        title: "Community Spotlight: Amazing Nuzlocke Runs",
        date: "2025-06-20",
        summary: "Highlighting incredible Terra Emerald Nuzlocke attempts from our community.",
        content: `
            <p>Our community has been absolutely incredible! We've seen some amazing Nuzlocke runs that showcase just how challenging Terra Emerald can be.</p>
            
            <h4>Featured Runs:</h4>
            <ul>
                <li><strong>@TrainerAlex_99:</strong> First documented successful Hardcore Nuzlocke completion!</li>
                <li><strong>@SynthMaster:</strong> Type: Null only run - currently at Victory Road</li>
                <li><strong>@EmberaldChamp:</strong> Randomizer Nuzlocke with incredible luck</li>
            </ul>
            
            <p>Want to share your run? Join our <a href="#" target="_blank">Discord</a> and post in the #nuzlocke-runs channel!</p>
            
            <h4>Upcoming Events:</h4>
            <p>We're planning a community tournament for next month. Stay tuned for more details!</p>
        `
    },
    {
        id: "2025-06-15-version-1-0-release",
        title: "Version 1.0 Released - The Null Protocol is Active!",
        date: "2025-06-15",
        summary: "The full Terra Emerald experience is now available! Download and begin your synthetic evolution journey.",
        content: `
            <p>After months of development, we're thrilled to announce that Terra Emerald Version 1.0 is officially released!</p>
            
            <h4>What's New in 1.0:</h4>
            <ul>
                <li><strong>Complete Story:</strong> Experience the full Terra Emerald campaign from start to finish</li>
                <li><strong>200+ Custom Trainer Teams:</strong> Every major trainer has been completely redesigned</li>
                <li><strong>Synthetic Pokemon Integration:</strong> Type: Null and Silvally are fully integrated into the world</li>
                <li><strong>Enhanced Difficulty:</strong> Prepare for the most challenging Pokemon experience yet</li>
                <li><strong>Quality of Life:</strong> Physical/Special split, updated movesets, and modern mechanics</li>
            </ul>
            
            <h4>Getting Started:</h4>
            <ol>
                <li>Visit our <a href="patch-applier.html">Patch Applier</a> page</li>
                <li>Upload your clean Pokemon Emerald ROM</li>
                <li>Download the patched ROM</li>
                <li>Load it in your favorite emulator</li>
                <li>Begin your journey!</li>
            </ol>
            
            <p><strong>Important:</strong> Make sure to use a clean Pokemon Emerald (U) ROM for best compatibility.</p>
            
            <h4>Community Resources:</h4>
            <ul>
                <li>Use our <a href="encounter-tracker.html">Encounter Tracker</a> for Nuzlocke runs</li>
                <li>Check the <a href="faq.html">FAQ</a> for common questions</li>
                <li>Join our Discord for tips, tricks, and community discussion</li>
            </ul>
            
            <p>Thank you to everyone who tested the beta versions and provided feedback. The Null Protocol is now active - good luck, trainers!</p>
        `
    },
    {
        id: "2025-05-30-beta-feedback",
        title: "Beta Testing Results & Final Adjustments",
        date: "2025-05-30",
        summary: "Community feedback has shaped the final version. Here's what changed based on your input.",
        content: `
            <p>Our beta testing phase has concluded, and we're amazed by the response from our community testers!</p>
            
            <h4>Key Changes Based on Feedback:</h4>
            <ul>
                <li><strong>Difficulty Curve:</strong> Smoothed out some difficulty spikes in the mid-game</li>
                <li><strong>Type: Null Availability:</strong> Made it slightly easier to obtain early Type: Null</li>
                <li><strong>Move Tutors:</strong> Added more move tutor options for synthetic Pokemon</li>
                <li><strong>UI Improvements:</strong> Better visual indicators for synthetic Pokemon types</li>
            </ul>
            
            <h4>Most Reported Issues (Now Fixed):</h4>
            <ul>
                <li>Memory disc compatibility problems</li>
                <li>Rare save corruption in specific areas</li>
                <li>AI trainers not using optimal strategies</li>
                <li>Visual glitches with certain Pokemon sprites</li>
            </ul>
            
            <p>Special thanks to our beta testers: @NullTrainer, @SyntheticMaster, @EmeraldVet, and 50+ others who provided detailed feedback!</p>
        `
    }
];

// Make the articles available globally so other scripts can access them
window.newsArticles = newsArticles;


// Helper function to get latest news articles
function getLatestNewsArticles(count = 3) {
    return newsArticles
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, count);
}

// Make function globally available
window.getLatestNewsArticles = getLatestNewsArticles;