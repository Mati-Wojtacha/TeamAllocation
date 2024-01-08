export function getPoints(data: any, results: any, player: any) {
    if (!data || !results || !player) {
        return 0;
    }

    if (data.length < 1) {
      return 0;
    }
    let result = 0;
    for (let i = 0; i < data[0].length; i++) {
      let insideTeam = -1;
      if (data[0][i].includes(player)) {
        insideTeam = 1;
      } else if (data[1][i].includes(player)) {
        insideTeam = 2;
      }

      if (insideTeam === -1 || !results[i] || !results[i].result1 || !results[i].result2) {
        continue;
      }

      const result1 = results[i].result1;
      const result2 = results[i].result2;

      if ((result1 >= result2 && insideTeam === 1) || (result1 <= result2 && insideTeam === 2)) {
        result++;
      }
    }
    return result;
  }
