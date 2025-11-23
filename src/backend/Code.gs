/**
 * Google Apps Script for Staff Operations Tool
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code into Code.gs.
 * 4. Run the 'setup' function once to create the sheet headers.
 * 5. Deploy as Web App:
 *    - Click 'Deploy' > 'New deployment'.
 *    - Select type: 'Web app'.
 *    - Execute as: 'Me'.
 *    - Who has access: 'Anyone'.
 *    - Copy the Web App URL and paste it into your React app (APPSCRIPT_URL).
 */

const CALENDAR_ID = 'primary'; // Use 'primary' or a specific Calendar ID
const SHEET_NAME = 'LeaveRequests';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Type', 'Dates', 'Status']);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { name, email, leaveType, dates } = data; // dates is array of "YYYY-MM-DD" strings

    if (!dates || dates.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'No dates selected' })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Check for Conflicts in Google Calendar
    const conflict = checkConflicts(dates);
    if (conflict) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: `Conflict detected! Leave already booked for ${conflict}.` 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Save to Google Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      setup();
      sheet = ss.getSheetByName(SHEET_NAME);
    }
    sheet.appendRow([new Date(), name, email, leaveType, dates.join(', '), 'Approved']);

    // 3. Create Calendar Events
    createCalendarEvents(name, leaveType, dates);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Leave approved and scheduled.' })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function checkConflicts(dateStrings) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  
  for (const dateStr of dateStrings) {
    const date = new Date(dateStr);
    const events = calendar.getEventsForDay(date);
    
    // Check if any event title contains "Leave" (simple logic, can be refined)
    const hasLeave = events.some(event => event.getTitle().toLowerCase().includes('leave'));
    
    if (hasLeave) {
      return dateStr; // Return the conflicting date
    }
  }
  return null;
}

function createCalendarEvents(name, type, dateStrings) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  
  for (const dateStr of dateStrings) {
    const date = new Date(dateStr);
    calendar.createAllDayEvent(`Leave: ${name} (${type})`, date, {
      description: `Leave request for ${name}. Type: ${type}`
    });
  }
}

// Handle CORS for local testing
function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT)
    .append("Access-Control-Allow-Origin: *")
    .append("Access-Control-Allow-Methods: POST, GET, OPTIONS")
    .append("Access-Control-Allow-Headers: Content-Type");
}
