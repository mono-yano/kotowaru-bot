import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const refuseMessages = [
		{who:"目上",what:"案件",how:"丁寧",message:"申し訳ありませんが他案件の対応でつまっており、対応できません。"},
		{who:"目上",what:"案件",how:"丁寧",message:"残念ながら既にスケジュールが埋まっており、対応が難しいです。またお声かけください。"},
		{who:"目上",what:"案件",how:"丁寧",message:"この度は、素敵な案件にお声掛けいただきありがとうございます。内容、確認いたしました。誠に恐縮ではございますが、ご提示いただいた条件では、○○までの対応となってしまいます。"},
		{who:"目上",what:"案件",how:"フランク",message:"その期間はリソース埋まっていて、無理そうです。またお願いいたします。"},
		{who:"目上",what:"案件",how:"フランク",message:"その期間はリソース埋まっていて、無理そうです。またお願いいたします。"},
		{who:"目上",what:"案件",how:"フランク",message:"その期間はリソース埋まっていて、無理そうです。またお願いいたします。"},
		{who:"目上",what:"飲み会",how:"丁寧",message:"申し訳ございませんが私用がありまして、今回は参加を見送らせていただきます"},
		{who:"目上",what:"飲み会",how:"丁寧",message:"ありがたいお話ではございますが、先約があり不参加とさせてください。ご期待に添えず申し訳ございません。"},
		{who:"目上",what:"飲み会",how:"丁寧",message:"このたびはお誘いくださいまして、誠にありがとうございます。せっかくのお誘いにも関わらず心苦しい限りではございますが、あいにく先約があり、今回は遠慮させて頂きます。また別の機会にご一緒させて頂ければと存じます。"},
		{who:"目上",what:"飲み会",how:"フランク",message:"その日は予定がありすみませんが欠席とさせてください。またお誘いお待ちしています。"},
		{who:"目上",what:"飲み会",how:"フランク",message:"その日は予定がありすみませんが欠席とさせてください。またお誘いお待ちしています。"},
		{who:"目上",what:"飲み会",how:"フランク",message:"その日は予定がありすみませんが欠席とさせてください。またお誘いお待ちしています。"},
		{who:"同僚",what:"案件",how:"丁寧",message:"お手伝いしたいのですが、リソース的に厳しいです。もし、手が空いたらお声かけしますね。"},
		{who:"同僚",what:"案件",how:"丁寧",message:"お手伝いしたいのですが、リソース的に厳しいです。もし、手が空いたらお声かけしますね。"},
		{who:"同僚",what:"案件",how:"丁寧",message:"お手伝いしたいのですが、リソース的に厳しいです。もし、手が空いたらお声かけしますね。"},
		{who:"同僚",what:"案件",how:"フランク",message:"ちょっとリソース埋まってる。ごめんなさい。"},
		{who:"同僚",what:"案件",how:"フランク",message:"ちょっとリソース埋まってる。ごめんなさい。"},
		{who:"同僚",what:"案件",how:"フランク",message:"ちょっとリソース埋まってる。ごめんなさい。"},
		{who:"同僚",what:"飲み会",how:"丁寧",message:"誘ってくれてありがとうございます。案件が立て込んでおり、参加できないです。また声かけてください。"},
		{who:"同僚",what:"飲み会",how:"丁寧",message:"誘ってくれてありがとうございます。案件が立て込んでおり、参加できないです。また声かけてください。"},
		{who:"同僚",what:"飲み会",how:"丁寧",message:"誘ってくれてありがとうございます。案件が立て込んでおり、参加できないです。また声かけてください。"},
		{who:"同僚",what:"飲み会",how:"フランク",message:"ごめん予定ありです。また誘ってください"},
		{who:"同僚",what:"飲み会",how:"フランク",message:"ごめん予定ありです。また誘ってください"},
		{who:"同僚",what:"飲み会",how:"フランク",message:"ごめん予定ありです。また誘ってください"}
	];

	function getWebviewContent(randomMessage: string) {
		function copyToClipboard() {
            vscode.env.clipboard.writeText(randomMessage);
        }
		return `<!DOCTYPE html>
		<html lang="ja">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
					.massage-text {
						user-select: all;
					}
					.copy-button {
						cursor: pointer;
						border-radius: 5px;
					}
				</style>
			</head>
			<body>
				<p class="massage-text">${randomMessage}</p>
				<button class="copy-button" onclick="${copyToClipboard()}">コピー</button>
			</body>
		</html>`;
	}

	let result = vscode.commands.registerCommand('vscode-refuse.refuse', async() => {
		const who = await vscode.window.showQuickPick(['目上', '同僚']);
		const what = await vscode.window.showQuickPick(['案件', '飲み会']);
		const how = await vscode.window.showQuickPick(['丁寧', 'フランク']);

		const isWho = (selected: { who: string; }) => selected.who === who;
		const isWhat = (selected: { what: string; }) => selected.what === what;
		const isHow = (selected: { how: string; }) => selected.how === how;

		const filteredMessages = refuseMessages.reduce((prev, current) => {
			if (isWho(current) && isWhat(current) && isHow(current)) {
				prev.push(current.message);
			}
			return prev;
		}, Array());

		const randomMessage = filteredMessages[Math.floor(Math.random() * filteredMessages.length)];



		if( what !== undefined) {
			const panel = vscode.window.createWebviewPanel(
				'kotowaru',
				`${who}の方への${what}の断りメッセージは以下になります！`,
				vscode.ViewColumn.One,
				{
					enableScripts: true
				}
			);

			panel.webview.html = getWebviewContent(randomMessage);
		}

	});

	context.subscriptions.push(result);


	// vscode右下にボタンを表示
	const button = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		0
	);
	button.command = 'vscode-refuse.refuse';
	button.text = 'kotowaru 💬';
	context.subscriptions.push(button);
	button.show();


}

export function deactivate() {}
