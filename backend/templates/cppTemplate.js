export const generateCppCode = (userCode, testCase, functionName) => {

  const nums = `{${testCase.input.nums.join(",")}}`;
  const target = testCase.input.target;

  return `
#include <bits/stdc++.h>
using namespace std;

// ===== USER CODE =====
${userCode}

int main() {

    vector<int> nums = ${nums};
    int target = ${target};

    Solution obj;
    vector<int> ans = obj.${functionName}(nums, target);

    cout << "[" << ans[0] << "," << ans[1] << "]";
    return 0;
}
`;
};
