document.addEventListener("DOMContentLoaded", function () 
{
    function getBrowserName() {
        var userAgent = navigator.userAgent;
        console.log(userAgent);
        if (userAgent.match(/opr\//i)) { return "Opera"; } 
        else if (userAgent.match(/edg/i)) { return "Edge"; } 
        else if (userAgent.match(/firefox|fxios/i)) { return "Firefox"; } 
        else if (userAgent.match(/chrome|chromium|crios/i)) { return "Chrome"; }
        else if (userAgent.match(/safari/i)) { return "Safari"; }
        else if (userAgent.match(/msie|trident/i)) { return "Internet Explorer"; }
        else { return "Unknown"; }
    }
    
    //Variables
    var tabIds = [];
    var table = document.createElement("table");
    
    function setupContent() 
    {
        var tabsContainer = document.getElementById("tabsContainer");
        // Clear the existing content
        tabsContainer.innerHTML = "";

        //Add table
        table.id = "taskTable";
        tabsContainer.appendChild(table);
        //Table description
        let descriptionRow = document.createElement("tr");
        descriptionRow.className = "description";
        //taskDis
        let taskDis = document.createElement("th");
        taskDis.className = "taskDis";
        taskDis.textContent = "Tab Name";
        descriptionRow.append(taskDis);
        //RamDis
        let ramDis = document.createElement("th");
        ramDis.className = "ramDis";
        ramDis.textContent = "Mem Usage";
        descriptionRow.append(ramDis);
        
        table.append(descriptionRow);
        
        
        chrome.tabs.query({}, function(tabs) {
            //* Loop through the array and create a flex column for each item
            for(let i = 0; i < tabs.length; i++)
            {
                let tab = tabs[i];
                tabIds.push(tab.id);
                /*
                //Add processes to permission in manifest.json
                // Get process ID for each tab
                chrome.processes.getProcessIdForTab(tab.id, function(processId) {
                    // Get process info for the process ID
                    chrome.processes.getProcessInfo(processId, false, function(processes) {
                        var process = processes[processId];
                        */
                        
                        
                        
                        
                        //*HTMl Adding
                        table.appendChild(makeRow(tab));
                        /*
                    });
                });
                */
            }
        });
    }
    
    function makeRow(tab)
    {
        //Row group
        let row = document.createElement("tr");
        row.className = "row";
        row.id = "row" + tab.id;
        
        
        //Task name
        let taskName = document.createElement("th");
        taskName.className = "taskName";
        taskName.textContent = tab.title;
        row.append(taskName);
        
        
        //Ram usage
        let ramUsage = document.createElement("th");
        ramUsage.className = "ramUsage";
        //tmp
        ramUsage.textContent = "N/A For Now";
        /*
        //If applicable
        if (process) {
            ramUsage.textContent = process.privateMemory;
        } 
        else { ramUsage.textContent = "N/A"; }
        */
        row.append(ramUsage);
        
        
        //Snooze button
        let snoozeButtonWindow = document.createElement("th");
        let snoozeButton = document.createElement("button");
        snoozeButton.className = "snoozeButton";
        snoozeButton.id = "snoozeButton" + tab.id;
        snoozeButton.textContent = "Snooze";
        //Add script to button
        snoozeButton.addEventListener("click", function() {
            // Your script logic here
            console.log("Snooze Button clicked!");
            chrome.tabs.discard(tab.id);
            document.getElementById("snoozeButton" + tab.id).style.backgroundColor = 'green';
        });
        snoozeButtonWindow.append(snoozeButton);
        row.append(snoozeButtonWindow);
        
        
        //Close button
        let closeButtonWindow = document.createElement("th");
        let closeButton = document.createElement("button");
        closeButton.className = "closeButton";
        closeButton.id = "closeButton" + tab.id;
        closeButton.textContent = "Close";
        //Add script to button
        closeButton.addEventListener("click", function() {
            // Your script logic here
            console.log("Close Button clicked!");
            chrome.tabs.remove(tab.id);
            document.getElementById("closeButton" + tab.id).style.backgroundColor = 'green';
        });
        closeButtonWindow.append(closeButton);
        row.append(closeButtonWindow);
        return row;
    }
    
    
    //! Refreshing content changes order of list each time
    function refreshContent() 
    {
        chrome.tabs.query({}, function(tabs) {
            //Remove old tab
            for(let i = 0; i < tabIds.length; i++)
            {
                oldTabID = tabIds[i];
                let found = false;
                for(let currID = 0; currID < tabs; currID++) {
                    let tab = tabs[i];
                    if(tab.id === oldTabID) {
                        found = true;
                        continue;
                    }
                }
                if(!found) {
                    let rowToRemove = document.getElementById("row" + oldTabID);
                    if (rowToRemove) { rowToRemove.remove(); }
                    tabIds.splice(i, 1);
                }
            }
            //Add new tabs
            for(let i = 0; i < tabs.length; i++)
            {
                let tab = tabs[i];
                let found = false;
                for(let currID = 0; currID < tabIds; currID++) {
                    oldTabID = tabIds[i];
                    if(tab.id === oldTabID) {
                        found = true;
                        continue;
                    }
                }
                if(!found) {
                    table.appendChild(makeRow(tab));
                    tabIds.push(tab.id);
                }
            }
        });
    }
    
    function sleepAll()
    {
        chrome.tabs.query({
            discarded:false,    //Non-discarded tabs
            active:false        //Not the one showing/focused on
        }, function(tabs) {
            for(let i = 0; i < tabs.length; i++) {
                chrome.tabs.discard(tabs[i].id);
            }
        });
    }
    
    
    function listTabs() {
    // Query all tabs
            chrome.tabs.query({}, function(tabs) {
            // Iterate through the tabs array
            tabs.forEach(function(tab) {
            // Log the tab ID and title (or any other tab properties you need)
            console.log('Tab ID:', tab.id, 'Title:', tab.title);
            });
        });
    }
    function listTabsAndMemoryUsage() {
        // Query all tabs
        chrome.tabs.query({}, function(tabs) {
            // Iterate through the tabs array using a for loop
            for (let i = 0; i < tabs.length; i++) {
                let tab = tabs[i];
                // Get process ID for each tab
                chrome.processes.getProcessIdForTab(tab.id, function(processId) {
                    // Get process info for the process ID
                    chrome.processes.getProcessInfo(processId, false, function(processes) {
                        var process = processes[processId];
                        // Check if process information is available
                        if (process) { console.log('Tab ID:', tab.id, 'Title:', tab.title, 'Memory Usage:', process.privateMemory); } 
                        else { console.log('Tab ID:', tab.id, 'Title:', tab.title, 'Memory Usage: Information not available'); }
                    });
                });
            }
        });
    }    
            
    
    
    
    
    // Initial content setup
    setupContent();
    
    // Button click event to refresh content
    var refreshButton = document.getElementById("refreshButton");
    refreshButton.addEventListener("click", function () {
        console.log("Refresh Button Pressed");
        refreshContent();
        //listTabsAndMemoryUsage();
        //console.log(getBrowserName());
    });
    
    
    // Button to snooze all
    var refreshButton = document.getElementById("snoozeAllButton");
    refreshButton.addEventListener("click", function () {
        console.log("Snooze All Button Pressed");
        sleepAll();
    });
    
    
    
    
    
    
});
