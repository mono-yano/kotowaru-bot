import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const refuseMessages = [
		{
			who: '目上',
			what: '案件',
			// 'how': '',
			message: 'この度は、お声掛けいただき恐れ入ります。大変恐縮ではございますが、ご提案いただいた日時ですとスケジュールが合わないためお受けすることができません。もし調整が可能であれば、○月○日以降であればお受けすることができますので、一度ご検討いただけますでしょうか。'
		},
		{
			who: '目上',
			what: '案件',
			// 'how': '',
			message: '111111111111111111111'
		},
		{
			who: '目上',
			what: '案件',
			// 'how': '',
			message: '2222222222222222222222222'
		},
		{
			who: '目上',
			what: '案件',
			// 'how': '',
			message: '33333333333333333'
		},
		{
			who: '目上',
			what: '案件',
			// 'how': '',
			message: '444444444444444444444444444444444444444'
		},
		// {
		// 	'who': '目上',
		// 	'what': '案件',
		// 	// 'how': '',
		// 	'message': 'いつもお世話になっております。新たなお仕事のご依頼をいただきまして誠にありがとうございます。検討させていただきましたが、誠に残念ながらスケジュール面での折り合いがつかず、お引き受けすることができない状況です。ご依頼をいただいたのにもかかわらずお役に立てず申し訳ございません。今後またこのような機会がございましたらぜひご協力させていただきたいので、その際はお手数をおかけしますがご連絡をいただけますと幸いです。'
		// },
		{
			who: '目上',
			what: '飲み会',
			// 'how': '丁寧',
			message: 'このたびはお誘いくださいまして、誠にありがとうございます。せっかくのお誘いにも関わらず心苦しい限りではございますが、あいにく先約があり、今回は遠慮させて頂きます。また別の機会にご一緒させて頂ければと存じます。'
		},
		{
			who: '同僚',
			what: '案件',
			// 'how': '丁寧',
			message: 'この度は、素敵な案件にお声掛けいただきありがとうございます。内容、確認いたしました。誠に恐縮ではございますが、ご提示いただいた条件では、○○までの対応となってしまいます。'

		},
		{
			who: '同僚',
			what: '飲み会',
			// 'how': '',
			message: 'お声がけいただき、ありがとうございます。せっかくのお誘いですが、当日は別の予定が入っているため参加は遠慮させていただきます。また次の機会にどうぞよろしくお願いします。'
		},
		{
			who: '同僚',
			what: '飲み会',
			// 'how': '',
			message: 'ランダム確認用1'
		},
		{
			who: '同僚',
			what: '飲み会',
			// 'how': '',
			message: 'ランダム確認用2ランダム確認用2'
		},
		{
			who: '同僚',
			what: '飲み会',
			// 'how': '',
			message: 'ランダム確認用3ランダム確認用3ランダム確認用3'
		}
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
		// const how = await vscode.window.showQuickPick(['丁寧', 'お笑い']);

		let refuseResult = refuseMessages.filter(message => message.who === who).filter(message => message.what === what);

		const array = refuseResult.flatMap(result => result.message);
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
