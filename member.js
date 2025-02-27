function skillsMember() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("Member");
  const range = sheet.getRange("A2:G");
  const values = range.getValues();
  const header = values[0];
  const headerMap = header.reduce((acc, value, index) => {
    acc[value] = index;
    return acc;
  }, {});
  const members = values.slice(1).map(row => {
    return {
      name: row[headerMap.Name],
      role: row[headerMap.Role],
      skills: row[headerMap.Skills],
      slack: row[headerMap.Slack],
      github: row[headerMap.GitHub],
      email: row[headerMap.Email],
      location: row[headerMap.Location],
    };
  });

  const skills = members
    .map(member => member.skills)
    .join(",")
    .split(",")
    .filter(skill => skill)
    .map(skill => skill.trim())
    .sort()
    .reduce((acc, skill) => {
      if (!acc[skill]) {
        acc[skill] = 0;
      }
      acc[skill] += 1;
      return acc;
    }, {});

  const skillsArray = Object.keys(skills).map(skill => {
    return [skill, skills[skill]];
  });

  const skillsRange = sheet.getRange("I2:J").clearContent();
  skillsRange.setValues(skillsArray);
}