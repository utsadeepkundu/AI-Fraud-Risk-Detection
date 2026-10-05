import pandas as pd

DATA_PATH = "data/raw/creditcard.csv"


def main():
    df = pd.read_csv(DATA_PATH)

    print("\n===== DATASET OVERVIEW =====")
    print("Shape:", df.shape)

    print("\n===== COLUMNS =====")
    print(df.columns.tolist())

    print("\n===== MISSING VALUES =====")
    print(df.isnull().sum().sum())

    print("\n===== DUPLICATE ROWS =====")
    print(df.duplicated().sum())

    print("\n===== CLASS DISTRIBUTION =====")
    print(df["Class"].value_counts())

    print("\n===== CLASS PERCENTAGE =====")
    print((df["Class"].value_counts(normalize=True) * 100).round(4))

    print("\n===== AMOUNT STATISTICS =====")
    print(df["Amount"].describe())

    print("\n===== FRAUD AMOUNT STATISTICS =====")
    print(df[df["Class"] == 1]["Amount"].describe())

    print("\n===== NORMAL AMOUNT STATISTICS =====")
    print(df[df["Class"] == 0]["Amount"].describe())


if __name__ == "__main__":
    main()