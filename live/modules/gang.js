import { ANSI } from "imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  const GANG_FACTION = "Slum Snakes"; // My Chosen Faction
  const ENEMY_FACTIONS = [
    // List of enemies
    "Tetrads",
    "The Syndicate",
    "The Dark Army",
    "Speakers for the Dead",
    "NiteSec",
    "The Black Hand",
  ];
  const ASCENSION_MULTIPLIER = 1.6487212707; // Minimum increase in stats for ascension
  const MAX_MEMBERS = 12; // Max num of gang members
  const MIN_WIN_PERCENT = 0.5; // Min win-rate for territory warfare
  const CRIMES = [
    "Mug People",
    "Deal Drugs",
    "Strongarm Civilians",
    "Run a Con",
    "Armed Robbery",
    "Traffick Illegal Arms",
    "Threaten & Blackmail",
    "Human Trafficking",
  ];

  function get_members() {
    return ns.gang.getMemberNames();
  }

  function get_karma() {
    let karma = Math.floor(ns.heart.break());
    ns.print(`Karma: ${karma}/-54000`);
    return karma;
  }

  function create_gang() {
    if (ns.gang.inGang()) {
      ns.print(`${ANSI.fg.yellow}Gang already made${ANSI.reset}`);
      return true;
    } else if (get_karma() > -54000) {
      ns.tprint(
        `${ANSI.fg.yellow}Not enough karma ${get_karma()}/-54000 (${Math.floor(
          get_karma() / -540
        )}%)${ANSI.reset}`
      );
      return false;
    } else {
      ns.gang.createGang(GANG_FACTION);
      return true;
    }
  }

  function recruit_member() {
    for (var i = 0; i <= get_members().length; i++) {
      if (ns.gang.recruitMember(`Dave ${i}`)) {
        return i;
      } else {
        continue;
      }
    }
    return -1;
  }

  function recruiting() {
    while (get_members().length < MAX_MEMBERS) {
      let member = recruit_member();
      if (member != -1) {
        ns.gang.setMemberTask(`Dave ${member}`, "Train Combat");
        ns.tprint(
          `${ANSI.fg.green} Recruited new member: Dave ${member}${ANSI.reset}`
        );
      } else {
        ns.print(`${ANSI.fg.red}Failed to recruit new member.${ANSI.reset}`);
        return;
      }
    }
  }

  function task(member) {
    let gang_info = ns.gang.getGangInformation();
    let wanted_level = gang_info.wantedLevel;
    let wanted_rate = gang_info.wantedLevelGainRate;
    let respect = gang_info.respect;
    let respect_gain = -1;
    let respect_rate = gang_info.respectGainRate;
    if (ns.fileExists("Formulas.exe", "home")) {
      respect_gain = ns.formulas.gang.respectGain(
        gang_info,
        ns.gang.getMemberInformation(member),
        ns.gang.getTaskStats("Terrorism")
      );
    } // If respect gain can be calculated, do it
    if (member == "Dave 0" && wanted_level > 0 && gang_info.respect > 10) {
      ns.gang.setMemberTask(member, "Vigilante Justice");
    } // If first dave and wanted is too high and respect is high enough, do justice
    if (
      (wanted_level > respect || wanted_rate > respect_rate) &&
      gang_info.respect > 10
    ) {
      ns.gang.setMemberTask(member, "Vigilante Justice");
    } // If wanted is above respect (rate or level) and there is more than 10 respect
    else if (respect_gain != -1 && respect_gain <= 0) {
      let member_factor = ns.gang.getMemberNames().length / 6; // doubles odds at full members, even odds at 6 members, 0.15x odds at 1 member.
      let wanted_factor = respect / (10 * wanted_level); // If wanted penalty is 10%, even odds, if less than 10% then odds go up and vice versa.
      if (
        ns.fileExists("Formulas.exe", "home") &&
        ns.formulas.gang.respectGain(
          gang_info,
          ns.gang.getMemberInformation(member),
          ns.gang.getTaskStats("Mug People")
        ) > 0
      ) {
        if (Math.random() * member_factor * wanted_factor > 0.5) {
          ns.gang.setMemberTask(member, "Train Combat");
        } else {
          ns.gang.setMemberTask(member, "Mug People");
        }
      } else {
        ns.gang.setMemberTask(member, "Train Combat");
      }
    } else if (
      // If we could calculate the respect gain and the respect gain is less than 0, Mug People
      respect_gain != -1 &&
      ns.gang.respectForNextRecruit() != Infinity &&
      gang_info.respect < ns.gang.respectForNextRecruit()
    ) {
      ns.gang.setMemberTask(member, "Terrorism");
    } else if (gang_info.territory == 1) {
      ns.gang.setMemberTask(member, "Human Trafficking");
    } else if (gang_info.wantedPenalty < 0.99) {
      if (gang_info.respect >= 99) {
        ns.gang.setMemberTask(member, "Vigilante Justice");
      } else {
        do_crime(member);
      }
    } else {
      ns.gang.setMemberTask(member, "Territory Warfare");
    }
  }

  function do_crime(member) {
    let gang_info = ns.gang.getGangInformation();
    if (!ns.fileExists("Formulas.exe", "home")) {
      ns.gang.setMemberTask(member, "Mug People");
      return;
    }
    let candidates = [];
    for (let crime of CRIMES) {
      let respect = ns.formulas.gang.respectGain(
        gang_info,
        ns.gang.getMemberInformation(member),
        ns.gang.getTaskStats(crime)
      );
      if (respect > 0) {
        candidates.push({ crime: crime, respect: respect });
      }
    }
    if (candidates.length < 1) {
      ns.gang.setMemberTask(member, "Train Combat");
      return;
    }
    let chosen = candidates.sort((a, b) => b.respect - a.respect)[0];
    ns.gang.setMemberTask(member, chosen.crime);
  }

  function war() {
    let worst_win_chance = 1;
    if (ns.gang.getGangInformation().territory == 1) {
      return false;
    }
    for (let faction of ENEMY_FACTIONS) {
      let current_win_chance = ns.gang.getChanceToWinClash(faction);
      if (
        worst_win_chance > current_win_chance &&
        ns.gang.getOtherGangInformation()[faction].territory > 0
      ) {
        worst_win_chance = current_win_chance;
      }
    }
    ns.print("Win chance: " + worst_win_chance);
    if (worst_win_chance > MIN_WIN_PERCENT && get_members().length >= 2) {
      return true;
    } else {
      return false;
    }
  }

  function ascension() {
    let multiplier = ASCENSION_MULTIPLIER * (12 / get_members().length);
    for (let member of get_members()) {
      let result = ns.gang.getAscensionResult(member);
      if (result) {
        let avg_multi =
          (result.agi +
            result.cha +
            result.def +
            result.dex +
            result.hack +
            result.str) /
          6;
        if (avg_multi > multiplier) {
          ns.print(`${ANSI.fg.green}Ascended ${member}${ANSI.reset}`);
          ns.gang.ascendMember(member);
        }
      }
    }
  }

  if (!ns.gang.inGang()) {
    create_gang();
  } else {
    ascension();
    let doing_war = war();
    if (doing_war) {
      ns.gang.setTerritoryWarfare(1);
    } else {
      ns.gang.setTerritoryWarfare(0);
    }
    ns.tprint(
      `${
        ANSI.fg.cyan
      }\nFaction: ${GANG_FACTION}\nKarma: ${get_karma()}/-54000\nMembers: ${get_members()}\nDoing War: ${doing_war}${
        ANSI.reset
      }`
    );
    recruiting();
    for (let member of get_members()) {
      await ns.gang.nextUpdate();
      task(member);
    }
  }
}
