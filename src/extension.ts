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

	function getWebviewContent(randomMessage: string[]) {

		return `<!DOCTYPE html>
		<html lang="ja">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
					.message-list {
						display: flex;
						flex-direction: column;
						gap: 10px;
					}
					.message-item {
						list-style: none;
					}
					.massage-text {
						user-select: all;
					}
					.copy-button {
						cursor: pointer;
					}
				</style>
			</head>
			<body>
				<ul id="messageList" class="message-list">
					<li class="message-item">
						<p class="massage-text">${randomMessage[0]}</p>
					</li>
					<li class="message-item">
						<p class="massage-text">${randomMessage[1]}</p>
					</li>
					<li class="message-item">
						<p class="massage-text">${randomMessage[2]}</p>
					</li>
				</ul>
			</body>
		</html>`;
	}

	let result = vscode.commands.registerCommand('vscode-refuse.refuse', async() => {
		const who = await vscode.window.showQuickPick(['目上', '同僚']);
		const what = await vscode.window.showQuickPick(['案件', '飲み会']);
		const how = await vscode.window.showQuickPick(['丁寧', 'フランク']);

		let refuseResult = refuseMessages.filter(message => message.who === who).filter(message => message.what === what).filter(message => message.how === how);

		const array = refuseResult.map(result => result.message);
		const randomMessage = randomSelect(array.slice(), 3);

		// 配列arrayからランダムにnumberの個数の要素を取り出す
		function randomSelect(array: string[], number:number)
		{
			let newArray = [];
			while(newArray.length < number && array.length > 0)
			{
				// 配列からランダムな要素を選ぶ
				const random = Math.floor(Math.random() * array.length);
				// 選んだ要素を別の配列に登録する
				newArray.push(array[random]);
				// もとの配列からは削除する
				array.splice(random, 1);
			}
			return newArray;
		}

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
