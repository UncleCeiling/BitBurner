import { Achievements } from "imports/achievements";
import { ANSI } from "imports/ANSI";
import * as exes from "imports/exes";
/** @param {NS} ns */
export async function main(ns) {
  // Initialise variables
  const CITIES = [
    "Aevum",
    "Chongqing",
    "Ishima",
    "New Tokyo",
    "Sector-12",
    "Volhaven",
  ];
  var player_stats = ns.getPlayer();
  var installed_augments = ns.singularity.getOwnedAugmentations(true);
  var karma = player_stats.karma;
  // Do the stuff
  accept_invites();
  if (study()) {
    return;
  }
  if (create_programs()) {
    return;
  }
  if (check_grafting()) {
    return;
  }
  if (farm_kills()) {
    return;
  }
  if (farm_karma(karma)) {
    return;
  }
  work_for_factions();
  // Search for more factions to get invites from?
  next_city();

  //#region ===== FUNCTIONS =====

  function study() {
    let focus = ns.singularity.isFocused();
    let working_on_achievement = new Achievements(ns).locked.has("MONEY_M1B");
    if (working_on_achievement) {
      ns.tprint(
        `${ANSI.fg.red}Working up a debt for achievement.${ANSI.reset}`
      );
      if (ns.singularity.getCurrentWork()?.classType == "Algorithms") {
        return true;
      }
      if (
        ns.singularity.universityCourse(
          "ZB Institute of Technology",
          "Algorithms",
          focus
        )
      ) {
        return true;
      }
      if (
        ns.singularity.universityCourse(
          "Summit University",
          "Algorithms",
          focus
        )
      ) {
        return true;
      }
      if (
        ns.singularity.universityCourse(
          "Rothman University",
          "Algorithms",
          focus
        )
      ) {
        return true;
      }
    }
    if (ns.getPlayer().skills.hacking < 80) {
      if (ns.getServerMoneyAvailable("home") <= 960 * 9 * 60) {
        if (ns.singularity.getCurrentWork()?.classType == "Computer Science") {
          return true;
        }
        if (
          ns.singularity.universityCourse(
            "ZB Institute of Technology",
            "Computer Science",
            focus
          )
        ) {
          return true;
        }
        if (
          ns.singularity.universityCourse(
            "Summit University",
            "Computer Science",
            focus
          )
        ) {
          return true;
        }
        if (
          ns.singularity.universityCourse(
            "Rothman University",
            "Computer Science",
            focus
          )
        ) {
          return true;
        }
      } else {
        if (ns.singularity.getCurrentWork()?.classType == "Algorithms") {
          return true;
        }
        if (
          ns.singularity.universityCourse(
            "ZB Institute of Technology",
            "Algorithms",
            focus
          )
        ) {
          return true;
        }
        if (
          ns.singularity.universityCourse(
            "Summit University",
            "Algorithms",
            focus
          )
        ) {
          return true;
        }
        if (
          ns.singularity.universityCourse(
            "Rothman University",
            "Algorithms",
            focus
          )
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function create_programs() {
    let exe_set = new exes.AllExes(ns).set;
    for (let exe of exe_set) {
      if (exe.exists) {
        continue;
      }
      // ns.tprint(`${exe.name} does not Exist - ${ns.getPlayer().skills.hacking} => ${exe.skill_req}`);
      if (ns.getPlayer().skills.hacking < exe.skill_req) {
        continue;
      }
      let focus = ns.singularity.isFocused();
      if (ns.singularity.createProgram(exe.name, focus)) {
        ns.tprint(`${ANSI.fg.cyan}Creating ${exe.name}.${ANSI.reset}`);
        return true;
      }
      return false;
    }
    return false;
  }

  /** Check for Grafting */
  function check_grafting() {
    let current_work = ns.singularity.getCurrentWork();
    if (current_work != null && current_work.augmentation != null) {
      return true;
    } else {
      return false;
    }
  }

  /** Farm Karma */
  function farm_karma(karma) {
    if (!ns.fileExists("enabled/gang.js", "home")) {
      return false;
    } // gang is not enabled
    if (karma <= -54000) {
      return false;
    } // Enough Karma
    ns.print(`Karma:${karma}`);
    let work = ns.singularity.getCurrentWork();
    if (work != null && work.type == "CRIME" && work.crimeType == "Homicide") {
      // If already doing homicide, continue
      ns.tprint(
        `${ANSI.fg.cyan}Continuing to commit Homicide to decrease Karma${ANSI.reset}`
      );
    } else {
      // Otherwise, start
      do_homicide();
      ns.tprint(
        `${ANSI.fg.cyan}Committing Homicide to decrease Karma${ANSI.reset}`
      );
    }
    return true;
  }

  /** Accept Faction invitations */
  function accept_invites() {
    let invitations = ns.singularity.checkFactionInvitations();
    for (let invite of invitations) {
      let invited_augments = ns.singularity.getAugmentationsFromFaction(invite);
      invited_augments = invited_augments.filter(
        (a) => !installed_augments.includes(a)
      );
      if (invited_augments.length > 0) {
        if (ns.singularity.joinFaction(invite)) {
          ns.tprint(`${ANSI.fg.cyan}Joined ${invite} faction.${ANSI.reset}`);
        } else {
          ns.tprint(
            `${ANSI.fg.red}Failed to join ${invite} faction.${ANSI.reset}`
          );
        }
      }
    }
  }

  /** Find lowest faction rep augment and work for it */
  function work_for_factions() {
    let joined_factions = ns.getPlayer().factions;
    let faction_details = [];
    for (let faction of joined_factions) {
      if (faction == "Slum Snakes"){continue}
      let work = ns.singularity.getFactionWorkTypes(faction);
      if (work.length == 0) {
        continue;
      }
      let faction_augments = ns.singularity
        .getAugmentationsFromFaction(faction)
        .filter((a) => !installed_augments.includes(a));
      let augments_to_buy = [];
      for (let aug of faction_augments) {
        augments_to_buy.push({
          name: aug,
          rep: ns.singularity.getAugmentationRepReq(aug),
        });
      }
      if (augments_to_buy <= 0) {
        continue;
      }
      if (
        augments_to_buy.sort((a, b) => b.rep - a.rep)[0].rep <
        ns.singularity.getFactionRep(faction)
      ) {
        continue;
      }
      faction_details.push({
        name: faction,
        work: work,
        augments_to_buy: augments_to_buy.sort((a, b) => b.rep - a.rep),
      });
    }
    if (faction_details.length > 0) {
      faction_details = faction_details.sort(
        (a, b) => a.augments_to_buy[0].rep - b.augments_to_buy[0].rep
      );
      let faction_choice = faction_details[0];
      let focus = ns.singularity.isFocused();
      if (ns.singularity.workForFaction(faction_choice.name, "field", focus)) {
        ns.tprint(
          `${ANSI.fg.green}Working in the field for ${faction_choice.name}.${ANSI.reset}`
        );
        return true;
      } else if (
        ns.singularity.workForFaction(faction_choice.name, "security", focus)
      ) {
        ns.tprint(
          `${ANSI.fg.green}Working Security for ${faction_choice.name}.${ANSI.reset}`
        );
        return true;
      } else if (
        ns.singularity.workForFaction(faction_choice.name, "hacking", focus)
      ) {
        ns.tprint(
          `${ANSI.fg.green}Hacking for ${faction_choice.name}.${ANSI.reset}`
        );
        return true;
      } else {
        ns.tprint(
          `${ANSI.fg.red}Failed to start ${work_choice} work for ${faction_choice.name}.${ANSI.reset}`
        );
        return false;
      }
    } else {
      return false;
    }
  }

  /** Move City */
  function next_city() {
    let player_city = CITIES.indexOf(player_stats.city);
    if (player_city <= 0) {
      player_city += CITIES.length;
    }
    let next_city = CITIES[player_city - 1];
    ns.tprint(
      `${ANSI.fg.cyan}Travelling from ${player_stats.city} to ${next_city}.${ANSI.reset}`
    );
    ns.singularity.travelToCity(next_city);
  }

  /** Make sure enough people have been killed */
  function farm_kills() {
    if (player_stats.numPeopleKilled < 30) {
      do_homicide();
      ns.tprint(
        `${ANSI.fg.cyan}Committing Homicide to increase body-count (${player_stats.numPeopleKilled}/30).${ANSI.reset}`
      );
      return true;
    } else {
      return false;
    }
  }

  /** Do Homicide */
  function do_homicide() {
    ns.singularity.commitCrime("Homicide", false);
  }
}
