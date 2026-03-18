from pyspark.sql import SparkSession
from pyspark.sql.functions import col, lit

# Global variables (to avoid re-creating Spark session & data)
spark = None
df = None


def get_spark_session():
    global spark
    if spark is None:
        spark = SparkSession.builder \
            .appName("TruthGuardAnalytics") \
            .master("local[*]") \
            .config("spark.driver.host", "127.0.0.1") \
            .config("spark.ui.enabled", "false") \
            .getOrCreate()
    return spark


def load_data():
    global df
    if df is None:
        spark = get_spark_session()

        # Load datasets
        fake = spark.read.csv("dataset/Fake.csv", header=True, inferSchema=True)
        true = spark.read.csv("dataset/True.csv", header=True, inferSchema=True)

        # Add labels
        fake = fake.withColumn("label", lit(1))
        true = true.withColumn("label", lit(0))

        # Combine datasets
        df = fake.union(true)

    return df


def get_fake_vs_real_count():
    df = load_data()

    result = df.groupBy("label").count().collect()

    output = {"fake": 0, "real": 0}

    for row in result:
        if row["label"] == 1:
            output["fake"] = row["count"]
        else:
            output["real"] = row["count"]

    return output


def get_top_topics():
    df = load_data()

    topics = df.groupBy("subject").count() \
        .orderBy(col("count").desc()) \
        .limit(5) \
        .collect()

    result = []

    for row in topics:
        result.append({
            "topic": row["subject"],
            "count": row["count"]
        })

    return result


def run_spark_analysis():
    return {
        "fake_vs_real": get_fake_vs_real_count(),
        "top_topics": get_top_topics()
    }
