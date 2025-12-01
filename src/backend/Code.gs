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

const CALENDAR_ID = 'primary';
const SHEET_LEAVE = 'LeaveRequests';
const SHEET_SALARY = 'SalaryAdvance';
const SPREADSHEET_ID = '1vOURGbtBBOeMZnOgjCWDHIr11XLrJ5yUsTw7yAEDnSk'; // <--- PASTE YOUR SHEET ID HERE

function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Setup Leave Sheet
  let leaveSheet = ss.getSheetByName(SHEET_LEAVE);
  if (!leaveSheet) {
    leaveSheet = ss.insertSheet(SHEET_LEAVE);
    leaveSheet.appendRow(['Timestamp', 'Name', 'Email', 'Type', 'Dates', 'Status']);
  }

  // Setup Salary Sheet
  let salarySheet = ss.getSheetByName(SHEET_SALARY);
  if (!salarySheet) {
    salarySheet = ss.insertSheet(SHEET_SALARY);
    salarySheet.appendRow(['Timestamp', 'Name', 'Email', 'Staff ID', 'Amount', 'Status']);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { action } = data;

    if (action === 'leave_request') {
      return handleLeaveRequest(data);
    } else if (action === 'salary_advance') {
      return handleSalaryAdvance(data);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown action' })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleLeaveRequest(data) {
  const { name, email, leaveType, dates } = data;

  if (!dates || dates.length === 0) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'No dates selected' })).setMimeType(ContentService.MimeType.JSON);
  }

  // 1. Check for Conflicts
  const conflict = checkConflicts(dates);
  if (conflict) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: `Conflict detected! Leave already booked for ${conflict}.` 
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Save to Google Sheet
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_LEAVE);
  if (!sheet) {
    try { setup(); sheet = ss.getSheetByName(SHEET_LEAVE); } catch (e) {}
  }
  
  if (sheet) {
     sheet.appendRow([new Date(), name, email, leaveType, dates.join(', '), 'Approved']);
  }

  // 3. Create Calendar Events
  createCalendarEvents(name, leaveType, dates);

  return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Leave approved and scheduled.' })).setMimeType(ContentService.MimeType.JSON);
}

function handleSalaryAdvance(data) {
  const { name, email, staffId, amount } = data;

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_SALARY);
  if (!sheet) {
    try { setup(); sheet = ss.getSheetByName(SHEET_SALARY); } catch (e) {}
  }

  if (sheet) {
    sheet.appendRow([new Date(), name, email, staffId, amount, 'Pending']);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Salary advance request submitted.' })).setMimeType(ContentService.MimeType.JSON);
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
