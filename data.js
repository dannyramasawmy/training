// =============================================================================
// Root
// =============================================================================

var romanian = new DataCard(
    "Romanian", "Romanian",
    "Data data data");
    romanian.SetParent(romanian);
    
// =============================================================================
// Verbs
// =============================================================================

var verbs = new DataCard(
    "Verbs", "Verbs",
    "<h> Verbs </h>")
    SetParentAndChild(romanian, verbs);
    
var love = new DataCard(
    "love", "iube",
    "To Love blah blah"
    )
    SetParentAndChild(verbs, love);
    
var run = new DataCard(
    "run", "sare",
    "To run blah blah"
    )
    SetParentAndChild(verbs, run);

// =============================================================================
// Prepositions
// =============================================================================

var prepositions = new DataCard(
    "prepositions", "prepositions",
    "Data")
    SetParentAndChild(romanian, prepositions);
    
// =============================================================================
// Adjectives
// =============================================================================

var adjectives = new DataCard(
    "adjectives", "adjectives",
    "Data")
SetParentAndChild(romanian, adjectives);
