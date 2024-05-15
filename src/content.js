window.onload = function() {
  console.log("All resources finished loading!");

  // `Account ID`を取得する関数
  function getAccountId() {
    const accountIdLabels = ["Account ID", "アカウント ID"]; // 各言語のラベル名を追加

    let accountIdLabelElement = null;
    for (const label of accountIdLabels) {
      accountIdLabelElement = Array.from(document.querySelectorAll('span')).find(span => span.textContent.trim().includes(label));
      if (accountIdLabelElement) {
        break;
      }
    }

    if (!accountIdLabelElement) {
      console.log("Account ID label element not found");
      return null;
    }

    const accountIdElement = accountIdLabelElement.nextElementSibling;
    if (!accountIdElement) {
      console.log("Account ID value element not found");
      return null;
    }

    const accountIdText = accountIdElement.textContent;
    console.log("Account ID text:", accountIdText);
    return accountIdText.match(/\d{4}-\d{4}-\d{4}/) ? accountIdText : null;
  }

  // セレクタで要素を取得してログ出力およびテキストの更新を行う関数
  function updateRoleName() {
    chrome.storage.sync.get('roleMappings', function(data) {
      const roleMappings = data.roleMappings || {};
      console.log("Role mappings:", roleMappings);

      const accountId = getAccountId();
      console.log("Extracted account ID:", accountId);
      if (!accountId) return;

      const elements = document.querySelectorAll('span[title*="AWSReservedSSO_"]');
      elements.forEach(element => {
        const title = element.getAttribute('title');
        if (title) {
          console.log("Found element with title:", title);
          const currentText = element.textContent;
          console.log("Current text:", currentText);

          const newRole = roleMappings[accountId];
          console.log("Mapped new role:", newRole);

          if (newRole) {
            const newText = currentText.replace(/@.*/, `@${newRole}`);
            element.textContent = newText;
            console.log("Updated text:", newText);
          } else {
            console.log("No matching role found for account ID:", accountId);
          }
        }
      });
    });
  }

  // MutationObserverを使用してDOMの変更を監視
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        const accountId = getAccountId();
        if (accountId) {
          console.log("Account ID found, executing updateRoleName");
          updateRoleName();
          observer.disconnect(); // 必要な要素が見つかったら監視を停止
        }
      }
    });
  });

  // オプション設定と監視対象の指定
  const observerConfig = {
    childList: true,
    subtree: true
  };

  const targetNode = document.body; // 監視対象ノード
  observer.observe(targetNode, observerConfig);
};
