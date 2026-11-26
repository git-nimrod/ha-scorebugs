# Getting started

Built on Home Assistant 2026.10.

## 1. Install Scorebugs with HACS

1. Open **HACS**, then the three-dot menu at the top right, then **Custom repositories**.
2. Paste `https://github.com/git-nimrod/ha-scorebugs`, set **Type** to **Integration**, and click **Add**.

3. Search HACS for **Scorebugs**, open it and click **Download**.

4. Restart Home Assistant: **Settings > System**, the power icon at the top right, **Restart Home Assistant**.

## 2. Add the integration

1. **Settings > Devices & services > Add integration** (bottom right).
2. Search for **Scorebugs**, pick it, and click **Submit**.

Scorebugs adds its dashboard card by itself. There is no resource to add by hand.

## 3. Follow your teams

1. **Settings > Devices & services > Scorebugs > Configure**. The menu shows the teams you follow.

2. Click **Add a team**, pick the **sport**, then the **league**.

3. Pick your **team** and its **logo version** (primary, dark, secondary, white...). For golf, racing, tennis and MMA you can follow
   the whole event, or one player from the current field.

4. Repeat for each team (up to 30). Each team gets a sensor named after its league and letters, like `sensor.scorebugs_nfl_chi`,
   that always holds its current or next game.

See [Leagues you can follow](leagues.md) for all 198 leagues.

## 4. Add a Scorebug card to a dashboard

1. Open a dashboard, click the **pencil** (Edit dashboard) at the top right, then **Add card**.
2. Search for **Scorebug** and pick it.

3. In the card editor, pick **your team**, then click the **look** you want. Every tile is a live preview of that look.

4. Click **Save**. The card shows your team's game before, during and after it, and "No game coming up" when there is none.

## 5. Make it yours (optional)

- **One look everywhere, or one per team**: **Configure > Scorebug looks**. A card that picked its own look keeps it.
- **How every card draws**: **Configure > How bugs look on cards** (logos, the network's spot, an old-TV picture, playoff looks...).
- **Your own picture in the network's spot**: **Configure > Your own mark**.
- **Automations**: each team has a **Look** entity (`select.scorebugs_..._look`) you can change from an automation or a dashboard.

All of these are explained in [Settings](settings.md). Every card option, including the ones only YAML offers, is in
[Card options](card-options.md). Something not working? See [Troubleshooting](troubleshooting.md).
