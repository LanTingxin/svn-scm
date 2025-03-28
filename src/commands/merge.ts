import { commands, window } from "vscode";
import { IBranchItem } from "../common/types";
import { isTrunk, selectBranch } from "../helpers/branch";
import { Repository } from "../repository";
import { Command } from "./command";

export class Merge extends Command {
  constructor() {
    super("svn.merge", { repository: true });
  }

  public async execute(repository: Repository) {
    const branch = await selectBranch(repository);

    if (!branch) {
      return;
    }

    await this.merge(repository, branch);
  }

  async merge(repository: Repository, branch: IBranchItem) {
    let reintegrate = false;
    if (isTrunk(repository.currentBranch)) {
      reintegrate = true;
    }

    try {
      await repository.merge(branch.path, reintegrate);
    } catch (error) {
      if (error !== null && typeof error === "object" && 'stderrFormated' in error) {
        if (typeof error.stderrFormated === 'string' && error.stderrFormated.includes("try updating first")) {
          const answer = await window.showErrorMessage(
            "Seems like you need to update first prior to merging. " +
              "Would you like to update now and try merging again?",
            "Yes",
            "No"
          );
          if (answer === "Yes") {
            await commands.executeCommand("svn.update");
            await this.merge(repository, branch);
          }
        } else {
          window.showErrorMessage(
            "Unable to merge branch: " + error.stderrFormated
          );
        }
      } else {
        console.log(error);
        window.showErrorMessage("Unable to merge branch");
      }
    }
  }
}
